(function(___scope___) { var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

realm.module("test.MySuperClass", ["myapp.myModule", "myapp.utils.lodash"], function (myModule, _) {
  var MySuperClass = function MySuperClass() {
    _classCallCheck(this, MySuperClass);
  };

  return MySuperClass;
});
realm.module("test.route.MainRoute", ["realm.router.path", "realm.router.inject", "realm.router.assert", "realm.router.cors", "test.route.Permissions"], function (path, inject, assert, cors, Permissions) {
  var _dec, _dec2, _dec3, _class;

  var MainRoute = (_dec = cors(), _dec2 = path("/"), _dec3 = inject(Permissions, '$permission'), _dec(_class = _dec2(_class = _dec3(_class = function () {
    function MainRoute() {
      _classCallCheck(this, MainRoute);
    }

    _createClass(MainRoute, null, [{
      key: "get",
      value: function get($query, $permission) {

        return {
          a: $permission
        };
      }
    }, {
      key: "post",
      value: function post() {}
    }]);

    return MainRoute;
  }()) || _class) || _class) || _class);
  ;

  return MainRoute;
});
realm.module("test.route.Permissions", ["realm.router.inject", "test.route.SomeStuff"], function (inject, SomeStuff) {
  var _dec4, _class2;

  var Permission = (_dec4 = inject(SomeStuff), _dec4(_class2 = function () {
    function Permission() {
      _classCallCheck(this, Permission);
    }

    _createClass(Permission, null, [{
      key: "inject",
      value: function inject($req, $attrs, SomeStuff) {
        return { "permission yee": "hello world", something: SomeStuff, attrs: $attrs };
      }
    }]);

    return Permission;
  }()) || _class2);


  return Permission;
});
realm.module("test.route.SomeStuff", [], function () {
  var SomeStuff = function () {
    function SomeStuff() {
      _classCallCheck(this, SomeStuff);
    }

    _createClass(SomeStuff, null, [{
      key: "inject",
      value: function inject($req) {
        return "some stuff from SomeStuff";
      }
    }]);

    return SomeStuff;
  }();

  return SomeStuff;
});
realm.module("test.components.FirstComponent", ["test.app.helpers.SuperUtils"], function (utils) {

  return function () {
    function _class3() {
      _classCallCheck(this, _class3);
    }

    return _class3;
  }();
});
realm.module("test.components.SecondComponent", ["test.app.helpers.UserInteractionUtils", "test.app.helpers.SuperUtils"], function (myUtls, utils) {

  return function () {
    function _class4() {
      _classCallCheck(this, _class4);
    }

    return _class4;
  }();
});
realm.module("test.helpers.SuperUtils", [], function () {

  return function () {
    function _class5() {
      _classCallCheck(this, _class5);
    }

    return _class5;
  }();
});
realm.module("test.helpers.UserInteractionUtils", [], function () {

  return function () {
    function _class6() {
      _classCallCheck(this, _class6);
    }

    return _class6;
  }();
});
})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('./index.js') : self.realm}}(this));