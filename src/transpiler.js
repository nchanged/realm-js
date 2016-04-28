var _ = require('lodash');
var es = require('event-stream');
var _ = require('lodash');

var Parser = function() {

   this.prevHas = function(token) {
      var rules = _.flatten(arguments);
      for (var i in rules) {
         if (_.indexOf(this.stack, token) > -1)
            return true
      }
      return false;
   }
   this.not = function(token) {
      var self = this;
      var rules = _.flatten(arguments);
      for (var i in rules) {
         if (_.indexOf(this.stack, rules[i]) > -1 || self.current === rules[i])
            return false
      }
      return true;
   }

   this.prev = function(token) {
      return this.stack[this.stack.length - 1] === token;
   }
   this.parse = function(list, cb) {
      var self = this;
      self.stack = [];
      cb = cb.bind(this);
      _.each(list, function(token) {
         self.current = token;
         cb(token);
         self.stack.push(token)
      });
   }
}
module.exports = {
   importify: function() {
      var self = this;
      return es.map(function(file, cb) {
         var fileContent = file.contents.toString()
         var content = self.str(fileContent);
         file.contents = new Buffer(content);
         cb(null, file);
      });
   },
   universalWrap: function() {
      var self = this;
      return es.map(function(file, cb) {
         var fileContent = file.contents.toString()
         file.contents = new Buffer(self.wrap(fileContent));
         cb(null, file);
      });
   },
   wrap: function(data) {
      var content = ['(function(isNode, realm) {\n'];
      content.push(data);
      content.push("\n})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('realm-js') : window.realm)");
      return content.join('');
   },
   str: function(input) {
      var fileContent = input;
      var moduleName;
      var lines = fileContent.split("\n");
      var newLines = [];
      var injections = [];
      var moduleResult;
      for (var i in lines) {
         var line = lines[i];
         var skipLine = false;
         // MODULE
         var moduleMatched;
         if ((moduleMatched = line.match(/^module\s+([a-z0-9.$_]+)/i))) {
            moduleName = moduleMatched[1];
            skipLine = true;
         }
         if (moduleName) {
            // exports
            var _exports = line.match(/^(export\s+)(.*)/);
            if (_exports && moduleName) {
               moduleResult = "___module__promised__";
               line = line.replace(_exports[1], "\tvar " + moduleResult + " = ");
            }
            // IMPORT
            if (line.match(/^import/ig)) {
               skipLine = true;
               var parser = new Parser();
               var tokens = line.match(/([a-z0-9$_.]+)/ig)
               var names = [];
               parser.parse(tokens, function(token) {
                  if (this.prev("as")) {
                     return names[names.length - 1].alias = token;
                  }
                  if (this.prevHas("import") && this.not('from') && token !== "as") {
                     return names.push({
                        name: token,
                        alias: token
                     });
                  }
                  if (this.prev("from")) {
                     return _.each(names, function(name) {
                        name.packageName = token;
                     });
                  }
               });
               _.each(names, function(item) {
                  injections.push(item);
               });
            }
         }
         if (skipLine === false) {
            newLines.push(line);
         }
      }

      if (moduleName) {
         var fn = ["realm.module(" + '"' + moduleName + '",[']
         var annotations = _.map(injections, function(item) {
            return '"' + (item.packageName ? item.packageName + "." : '') + item.name + '"';
         });
         var moduleNames = _.map(injections, function(item) {
            return item.alias;
         });
         fn.push(annotations.join(", "));
         fn.push("], \n\tfunction(");
         fn.push(moduleNames.join(", "))
         fn.push("){");
         newLines.splice(0, 0, fn.join(''))
         if (moduleResult) {
            newLines.push("\treturn " + moduleResult + ";")
         }
         newLines.push("});")
      }
      return newLines.join('\n');
   }

}
