"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (isNode, realm) {
    console.log("this is a simple file");

    realm.module("test./hello.World", ["realm.router.path", "realm.router.inject", "realm.router.assert", "realm.router.cors", "test.injectors.Permission"], function (path, inject, assert, cors, Permission) {
        var World = function () {
            function World() {
                _classCallCheck(this, World);
            }

            _createClass(World, null, [{
                key: "post",
                value: function post() {}
            }]);

            return World;
        }();

        return World;
    });
})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('./index.js') : window.realm);