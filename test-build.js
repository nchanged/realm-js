(function(isNode, realm) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

realm.module("test.route.Main", ["realm.router.path", "realm.router.interceptor", "realm.router.assert", "realm.router.cors"], function (path, interceptor, assert, cors) {
	var _dec, _dec2, _dec3, _class;

	var MainRoute = (_dec = cors(), _dec2 = path("/"), _dec3 = interceptor("test.interceptors.Permission"), _dec(_class = _dec2(_class = _dec3(_class = function () {
		function MainRoute() {
			_classCallCheck(this, MainRoute);
		}

		_createClass(MainRoute, null, [{
			key: "get",
			value: function get($query) {
				i++;
				return { a: $query.get("hello@int", 1) };
			}
		}, {
			key: "post",
			value: function post() {}
		}]);

		return MainRoute;
	}()) || _class) || _class) || _class);
	;

	var ___module__promised__ = MainRoute;

	return ___module__promised__;
});
realm.module("test.interceptors.Permission", [], function () {

	var Permission = function Permission($req) {};

	var ___module__promised__ = Permission;

	return ___module__promised__;
});
realm.module("app.components.FirstComponent", ["app.helpers.SuperUtils"], function (utils) {

	////
	var ___module__promised__ = function ___module__promised__() {
		_classCallCheck(this, ___module__promised__);
	};

	return ___module__promised__;
});
realm.module("app.components.SecondComponent", ["app.helpers.UserInteractionUtils", "app.helpers.SuperUtils"], function (myUtls, utils) {

	var ___module__promised__ = function ___module__promised__() {
		_classCallCheck(this, ___module__promised__);
	};

	return ___module__promised__;
});
realm.module("app.helpers.SuperUtils", [], function () {

	var ___module__promised__ = function ___module__promised__() {
		_classCallCheck(this, ___module__promised__);
	};

	return ___module__promised__;
});
realm.module("app.helpers.UserInteractionUtils", [], function () {

	var ___module__promised__ = function ___module__promised__() {
		_classCallCheck(this, ___module__promised__);
	};

	return ___module__promised__;
});
})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('./index.js') : window.realm)