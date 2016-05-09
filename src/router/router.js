var pathToRegexp = require('path-to-regexp');
var _ = require('lodash');
var realm = require('../realm').realm;
var query_getter = require('./query_getter.js');
var NiceTrace = require("./traceback.js");
var Promise = require("promise");
var logger = require("log4js").getLogger("realm.router");
var Promise = require("promise");
var RestFul = [];
var Options = {};
var Interceptors = {};


realm.module("realm.router.path", function() {
   return function(path) {
      return function(target, property, descriptor) {
         RestFul.push({
            path: path,
            handler: target
         });
      }
   }
});

realm.module("realm.router.cors", function() {
   return function(path) {
      return function(target, property, descriptor) {
         target.__cors = true;
      }
   }
});

realm.module("realm.router.interceptors", function() {
   return function() {
      var args = arguments;
      return function(target, property, descriptor) {
         target.__interceptors = _.flatten(args);
      }
   }
});

realm.module("realm.router.assert", function() {
   var _throw = function(code, msg) {
      throw {
         status: code,
         message: msg
      };
   }
   return {
      bad_request: function(message) {
         return _throw(400, message || "Bad request");
      },
      unauthorized: function(message) {
         return _throw(401, message || "Unauthorized");
      },
      not_found: function(message) {
         return _throw(404, message || "Not Found");
      }
   }
});

var getResourceCandidate = function(resources, startIndex, url) {
   for (var i = startIndex; i < resources.length; i++) {
      var item = resources[i];
      var keys = [];
      var re = pathToRegexp(item.path, keys);
      params = re.exec(url);
      if (params) {
         return {
            params: params,
            keys: keys,
            handler: item.handler,
            nextIndex: i + 1
         };
      }
   }
};

// Register local services
// Will be available only on rest service construct
var restLocalServices = function(info, params, req, res) {
   var services = {
      $req: req,
      $res: res,
      $params: params,
      // Next function tries to get next
      $next: function() {
         var resources = RestFul;
         var data = getResourceCandidate(resources, info.nextIndex, req.path);
         if (data) {
            return callCurrentResource(data, req, res);
         }
      }
   };
   return services;
};

var getAssertHandler = function(_locals) {
   return new Promise(function(resolve, reject) {
      if (realm.isRegistered("WiresAssertHandler")) {
         return realm.require('WiresAssertHandler', _locals, function(WiresAssertHandler) {
            return resolve(WiresAssertHandler);
         });
      }
      return resolve();
   })
}
var callCurrentResource = function(info, req, res) {

   // Extract params
   var mergedParams = {};
   var params = info.params;
   var handler = info.handler;

   _.each(info.keys, function(data, index) {
      var i = index + 1;
      if (params[i] !== null && params[i] !== undefined) {
         var parameterValue = params[i];
         if (parameterValue.match(/^\d{1,4}$/)) {
            parameterValue = parseInt(parameterValue);
         }
         mergedParams[data.name] = parameterValue;
      }
   });

   // Define method name
   var method = req.method.toLowerCase();

   // Define parse options
   var parseOptions;

   if (handler[method]) {
      parseOptions = {
         source: handler[method],
         target: handler[method],
         instance: handler
      };
   }

   // If there is nothing to execute
   if (!parseOptions) {
      return res.status(501).send({
         error: 501,
         message: "Not implemented"
      });
   }

   if (method === "options" && handler.__cors === true) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Session");
      return res.send({});
   }
   // setting cors headers for any other method
   if (handler.__cors) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Session");
   }

   var executeInteceptor = function() {
      return new Promise(function(resolve, reject) {
         if (!handler.__interceptors)
            return resolve();
         if( _.isArray(handler.__interceptors) ){
            return realm.each(handler.__interceptors, function(str){
               var p = Options.interceptors ? Options.interceptors + "." + str : str;
               return realm.require(p, function(remoteInterceptor){
                  return realm.require(remoteInterceptor,
                     restLocalServices(info, mergedParams, req, res));
               });

            }).then(function(items){
               var response = {};
               _.each(items, function(data){
                  _.each(data, function(value, key){
                     if( _.isString(key) ){
                        response[key] = value;
                     }
                  });
               });
               return response;
            }).then(resolve).catch(reject);
         }
         return resolve();
      });
   }
   var requireAndCallDestination = function() {
      executeInteceptor().then(function(additionalServices) {
         var _localServices = restLocalServices(info, mergedParams, req, res);
         if (additionalServices && _.isPlainObject(additionalServices)) {
            _localServices = _.merge(_localServices, additionalServices);
         }

         return realm.require(parseOptions, _localServices).then(function(result) {
            if (result !== undefined) {
               return res.send(result);
            }
         })
      }).catch(function(e) {
         var err = {
            status: 500,
            message: "Error"
         };

         logger.fatal(e.stack || e);
         // If we have a direct error
         if (e.stack) {
            if(Options.prettyErrors){
               return res.status(500).send(NiceTrace(e));
            }
            return res.status(500).send({
               status: 500,
               message: "Server Error"
            });
         }

         if (_.isObject(e)) {
            var status = e.status || 500;
            e.message = e.message || "Server Error";
            return getAssertHandler(restLocalServices(info, mergedParams, req, res)).then(function(
               assertHandler) {
               if (assertHandler) {
                  return assertHandler(e);
               }
               return e;
            }).then(function(result) {
               return res.status(status).send(result !== undefined ? result : err);
            }).catch(function(e) {
               logger.fatal(e.stack || e);
               return res.status(500).send({
                  status: 500,
                  message: "Server Error"
               });
            });
         }
         res.status(err.status).send(err);
      });
   };
   return requireAndCallDestination();
};
var express = function(req, res, next) {

   var resources = RestFul;
   var data = getResourceCandidate(resources, 0, req.path);
   if (!data) {
      return next();
   }

   return callCurrentResource(data, req, res);
};

module.exports = {
   init: function(_package) {
      return realm.requirePackage(_package);
   },
   express: function(_package, opts) {
      opts = opts || {};
      if ( opts.prettyErrors){
         Options.prettyErrors = true;
      }
      if ( opts.interceptors){
         Options.interceptors = opts.interceptors;
      }
      this.init(_package).then(function(_packages){
         logger.info("Package '%s' has been successfully required", _package);
         logger.info("Injested %s routes", _.keys(_packages).length );
      }).catch(function(e){
         logger.fatal(e.stack || e);
      })
      return express;
   }
};
