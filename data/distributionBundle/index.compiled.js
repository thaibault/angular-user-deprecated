'use strict';
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@angular/forms"), require("angular-generic"), require("@angular/common"), require("@angular/core"), require("@angular/material"), require("@angular/platform-browser"), require("@angular/router"), require("pouchdb-authentication/dist/pouchdb.authentication.min.js"), require("rxjs/Observable"), require("rxjs/add/observable/fromPromise"));
	else if(typeof define === 'function' && define.amd)
		define("angular-user", ["@angular/forms", "angular-generic", "@angular/common", "@angular/core", "@angular/material", "@angular/platform-browser", "@angular/router", "pouchdb-authentication/dist/pouchdb.authentication.min.js", "rxjs/Observable", "rxjs/add/observable/fromPromise"], factory);
	else if(typeof exports === 'object')
		exports["angular-user"] = factory(require("@angular/forms"), require("angular-generic"), require("@angular/common"), require("@angular/core"), require("@angular/material"), require("@angular/platform-browser"), require("@angular/router"), require("pouchdb-authentication/dist/pouchdb.authentication.min.js"), require("rxjs/Observable"), require("rxjs/add/observable/fromPromise"));
	else
		root['angularUser'] = factory(root["@angular/forms"], root["angular-generic"], root["@angular/common"], root["@angular/core"], root["@angular/material"], root["@angular/platform-browser"], root["@angular/router"], root["pouchdb-authentication/dist/pouchdb.authentication.min.js"], root["rxjs/Observable"], root["rxjs/add/observable/fromPromise"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module angularUser *//* !
    region header
    [Project page](http://torben.website/angularUser)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/// region imports
Object.defineProperty(exports,'__esModule',{value:true});exports.default=exports.LoginComponent=exports.AuthenticationGuard=exports.AuthenticationService=undefined;var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _dec,_class,_class2,_temp,_dec2,_class3,_class4,_temp2,_dec3,_dec4,_dec5,_dec6,_class5,_desc,_value,_class6,_descriptor,_descriptor2,_descriptor3,_dec7,_class8;var _angularGeneric=__webpack_require__(3);var _angularGeneric2=_interopRequireDefault(_angularGeneric);var _common=__webpack_require__(4);var _core=__webpack_require__(5);var _forms=__webpack_require__(6);var _material=__webpack_require__(7);var _platformBrowser=__webpack_require__(8);var _router=__webpack_require__(9);var _pouchdbAuthentication=__webpack_require__(10);var _pouchdbAuthentication2=_interopRequireDefault(_pouchdbAuthentication);var _Observable=__webpack_require__(11);__webpack_require__(12);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _initDefineProp(target,property,descriptor,context){if(!descriptor)return;Object.defineProperty(target,property,{enumerable:descriptor.enumerable,configurable:descriptor.configurable,writable:descriptor.writable,value:descriptor.initializer?descriptor.initializer.call(context):void 0})}function _applyDecoratedDescriptor(target,property,decorators,descriptor,context){var desc={};Object['ke'+'ys'](descriptor).forEach(function(key){desc[key]=descriptor[key]});desc.enumerable=!!desc.enumerable;desc.configurable=!!desc.configurable;if('value'in desc||desc.initializer){desc.writable=true}desc=decorators.slice().reverse().reduce(function(desc,decorator){return decorator(target,property,desc)||desc},desc);if(context&&desc.initializer!==void 0){desc.value=desc.initializer?desc.initializer.call(context):void 0;desc.initializer=undefined}if(desc.initializer===void 0){Object['define'+'Property'](target,property,desc);desc=null}return desc}function _initializerWarningHelper(descriptor,context){throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.')}function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}}return step('next')})}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}// NOTE: Only needed for debugging this file.
try{module.require('source-map-support/register')}catch(error){}// endregion
var initialWrappableMethodNames=_angularGeneric.DataService.wrappableMethodNames.slice();_angularGeneric.DataService.wrappableMethodNames.push('getSession','login','logout');// region services
// IgnoreTypeCheck
/**
 * A service to handle user sessions and their authentication.
 * @property static:databaseMethodNamesToIntercept - Database method names to
 * intercept for authenticated requests.
 *
 * @property data - Holds a database connection and helper methods.
 * @property error - Error object describing last failed authentication try.
 * @property lastRequestedURL - Saves the last requested url before login to
 * redirect to after authentication was successful.
 * @property login - Login method of current connection instance.
 * @property loginName - Currently logged in user name.
 * @property loginNamesToDeauthenticate - Login names to de-authenticate.
 * @property loginPromise - Promise describing currently running authentication
 * process.
 * @property resolveLogin - Function to resolve current login authentication
 * process.
 * @property observingDatabaseChanges - Indicates if each database change
 * should be intercept to deal with not authorized requests.
 */var AuthenticationService=exports.AuthenticationService=(_dec=(0,_core.Injectable)(),_dec(_class=(_temp=_class2=function(){/**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @returns Nothing.
     */function AuthenticationService(data){var _this=this;_classCallCheck(this,AuthenticationService);this.data=this.data;this.error=null;this.lastRequestedURL=null;this.login=this.login;this.loginName=null;this.loginNamesToDeauthenticate=new Set;this.loginPromise=this.loginPromise;this.resolveLogin=this.resolveLogin;this.session=null;this.observingDatabaseChanges=true;this.data=data;// TODO too late to be respected for generic method interceptions.
this.data.database=this.data.database.plugin(_pouchdbAuthentication2.default);this.login=function(){var _ref=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee(){var password=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'readonlymember';var login=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'readonlymember';var result;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_this.loginName=null;if(!_this.loginNamesToDeauthenticate.has(login)){_context.next=3;break}return _context.abrupt('return',false);case 3:result=void 0;_context.prev=4;_context.next=7;return _this.data.remoteConnection.login(login,password);case 7:result=_context.sent;_context.next=13;break;case 10:_context.prev=10;_context.t0=_context['catch'](4);throw _context.t0;case 13:if(!result){_context.next=16;break}_this.loginName=login;return _context.abrupt('return',true);case 16:return _context.abrupt('return',false);case 17:case'end':return _context.stop();}}},_callee,_this,[[4,10]])}));return function(){return _ref.apply(this,arguments)}}();this.loginPromise=new Promise(function(resolve){_this.resolveLogin=resolve});this.data.interceptSynchronisationPromise=this.loginPromise}/**
     * Checks if current session can be authenticated.
     * @param unauthorizedCallback - Function to call if an unauthorized
     * request happens.
     * @returns A promise with an indicating boolean inside.
     */_createClass(AuthenticationService,[{key:'checkLogin',value:function(){var _ref2=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee4(){var _this2=this;var unauthorizedCallback=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(error,result){return result};var waitForSynchronisation;return regeneratorRuntime.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(this.data.remoteConnection){_context4.next=2;break}return _context4.abrupt('return',true);case 2:this.session=null;_context4.prev=3;_context4.next=6;return this.data.remoteConnection.getSession();case 6:this.session=_context4.sent;_context4.next=14;break;case 9:_context4.prev=9;_context4.t0=_context4['catch'](3);this.loginName=null;this.error=_context4.t0;return _context4.abrupt('return',false);case 14:this.error=null;if(!this.session.userCtx.name){_context4.next=29;break}if(!this.loginNamesToDeauthenticate.has(this.session.userCtx.name)){_context4.next=18;break}return _context4.abrupt('return',false);case 18:this.loginName=this.session.userCtx.name;if(this.observingDatabaseChanges){this.data.register(this.constructor.databaseMethodNamesToIntercept,function(){var _ref3=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee2(result){return regeneratorRuntime.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.prev=0;_context2.next=3;return result;case 3:result=_context2.sent;_context2.next=19;break;case 6:_context2.prev=6;_context2.t0=_context2['catch'](0);if(!(_context2.t0.hasOwnProperty('name')&&_context2.t0.name==='unauthorized')){_context2.next=18;break}_this2.loginName=null;if(_this2.data.synchronisation){_this2.data.synchronisation.cancel();_this2.data.synchronisation=null}result=unauthorizedCallback(_context2.t0,result);if(!((typeof result==='undefined'?'undefined':_typeof(result))==='object'&&result!==null&&'then'in result)){_context2.next=16;break}_context2.next=15;return result;case 15:result=_context2.sent;case 16:_context2.next=19;break;case 18:throw _context2.t0;case 19:return _context2.abrupt('return',result);case 20:case'end':return _context2.stop();}}},_callee2,_this2,[[0,6]])}));return function(_x4){return _ref3.apply(this,arguments)}}());this.data.register('logout',function(){var _ref4=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee3(result){return regeneratorRuntime.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.prev=0;_context3.next=3;return result;case 3:result=_context3.sent;_context3.next=9;break;case 6:_context3.prev=6;_context3.t0=_context3['catch'](0);throw _context3.t0;case 9:_this2.loginName=null;if(_this2.data.synchronisation){_this2.data.synchronisation.cancel();_this2.data.synchronisation=null}return _context3.abrupt('return',result);case 12:case'end':return _context3.stop();}}},_callee3,_this2,[[0,6]])}));return function(_x5){return _ref4.apply(this,arguments)}}())}_context4.next=22;return this.resolveLogin(this.session);case 22:waitForSynchronisation=false;if(this.data.synchronisation===null){this.data.startSynchronisation();waitForSynchronisation=true}this.loginPromise=new Promise(function(resolve){_this2.resolveLogin=resolve});if(!waitForSynchronisation){_context4.next=28;break}_context4.next=28;return new Promise(function(resolve){return _this2.data.synchronisation.on('pause',resolve)});case 28:return _context4.abrupt('return',true);case 29:this.loginName=null;if(this.data.synchronisation){this.data.synchronisation.cancel();this.data.synchronisation=null}return _context4.abrupt('return',false);case 32:case'end':return _context4.stop();}}},_callee4,this,[[3,9]])}));function checkLogin(){return _ref2.apply(this,arguments)}return checkLogin}()}]);return AuthenticationService}(),_class2.databaseMethodNamesToIntercept=initialWrappableMethodNames,_temp))||_class);// IgnoreTypeCheck
Reflect.defineMetadata('design:paramtypes',[_angularGeneric.DataService],AuthenticationService);/**
 * A guard to intercept each route change and checkt for a valid authorisation
 * before.
 * @property static:loginPath - Defines which url should be used as login path.
 *
 * @property data - Holds a database connection and helper methods.
 * @property router - Holds the current router instance.
 */var AuthenticationGuard/* implements CanActivate, CanActivateChild*/=exports.AuthenticationGuard=(_dec2=(0,_core.Injectable)(),_dec2(_class3=(_temp2=_class4=function(){/**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param router - Router service.
     * @returns Nothing.
     */function AuthenticationGuard(authentication,router){_classCallCheck(this,AuthenticationGuard);this.authentication=this.authentication;this.data=this.data;this.router=this.router;this.authentication=authentication;this.router=router}/**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */_createClass(AuthenticationGuard,[{key:'canActivate',value:function canActivate(route,state){return _Observable.Observable.fromPromise(this.checkLogin(state.url))}/**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */},{key:'canActivateChild',value:function canActivateChild(route,state){return this.canActivate(route,state)}/**
     * Checks if current session can be authenticated again given url.
     * @param url - New url to switch to.
     * @param autoRoute - Auto route to login page if authentication is not
     * valid.
     * @returns A promise with an indicating boolean inside.
     */},{key:'checkLogin',value:function(){var _ref5=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee5(){var _this3=this;var url=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;var autoRoute=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;return regeneratorRuntime.wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.next=2;return this.authentication.checkLogin(function(error,result){_this3.router.navigate([_this3.constructor.loginPath]);return result});case 2:if(!_context5.sent){_context5.next=4;break}return _context5.abrupt('return',true);case 4:if(url)this.authentication.lastRequestedURL=url;if(autoRoute)this.router.navigate([this.constructor.loginPath]);return _context5.abrupt('return',false);case 7:case'end':return _context5.stop();}}},_callee5,this)}));function checkLogin(){return _ref5.apply(this,arguments)}return checkLogin}()}]);return AuthenticationGuard}(),_class4.loginPath='/login',_temp2))||_class3);// endregion
// region components
// IgnoreTypeCheck
Reflect.defineMetadata('design:paramtypes',[AuthenticationService,_router.Router],AuthenticationGuard);/**
 * A generic login component to fill user credentials into a form.
 * @property errorMessage - Holds a string representing an error message
 * representing the current authentication state.
 * @property keyCode - Mapping from key code to their description.
 * @property loginName - Holds given login.
 * @property password - Holds given password.
 *
 * @property _authentication - The authentication guard service.
 * @property _data - The database service.
 * @property _representObject - A reference to the represent object pipe
 * transformation function.
 * @property _router - The router service.
 */var LoginComponent=exports.LoginComponent=(_dec3=(0,_core.Component)({animations:[(0,_angularGeneric.defaultAnimation)()],changeDetection:_core.ChangeDetectionStrategy.OnPush,host:{'[@defaultAnimation]':'','(window:keydown)':'$event.keyCode === keyCode.ENTER ? login() : null'},selector:'login',template:'\n        <div class="message" @defaultAnimation *ngIf="errorMessage">\n            {{errorMessage}}\n        </div>\n        <mat-form-field>\n            <input matInput [(ngModel)]="loginName" [placeholder]="loginLabel">\n            <mat-icon matSuffix>account_circle</mat-icon>\n        </mat-form-field>\n        <mat-form-field>\n            <input\n                matInput\n                [(ngModel)]="password"\n                [placeholder]="passwordLabel"\n                type="password"\n            >\n            <mat-icon matSuffix>lock</mat-icon>\n        </mat-form-field>\n        <button\n            (click)="login()"\n            @defaultAnimation\n            mat-raised-button\n            *ngIf="loginName && password"\n        >{{loginButtonLabel}}</button>\n    '}),_dec4=(0,_core.Input)(),_dec5=(0,_core.Input)(),_dec6=(0,_core.Input)(),_dec3(_class5=(_class6=function(){/**
     * @param authentication - Holds an instance of the current authentication
     * service.
     * @param authenticationGuard - Holds an instance of the current
     * authentication guard service.
     * @param data - Holds the database service instance.
     * @param platformID - Platform identification string.
     * @param router - Holds the router instance.
     * @param representObjectPipe - A reference to the represent object pipe.
     * @param tools - Tools kit.
     * @returns Nothing.
     */function LoginComponent(authentication,authenticationGuard,data,platformID,router,representObjectPipe,tools){var _this4=this;_classCallCheck(this,LoginComponent);this.errorMessage='';this.keyCode=this.keyCode;this.loginName=this.loginName;_initDefineProp(this,'loginButtonLabel',_descriptor,this);_initDefineProp(this,'loginLabel',_descriptor2,this);this.password=this.password;_initDefineProp(this,'passwordLabel',_descriptor3,this);this._authentication=this._authentication;this._data=this._data;this._representObject=this._representObject;this._router=this._router;this.keyCode=tools.tools.keyCode;this._authentication=authentication;this._authenticationGuard=authenticationGuard;// NOTE: Allow to pre-render the login page.
if(!(0,_common.isPlatformServer)(platformID))this._authenticationGuard.checkLogin().then(function(loggedIn){if(loggedIn)_this4._router.navigate(['/'])});this._data=data;this._representObject=representObjectPipe.transform.bind(representObjectPipe);this._router=router}/**
     * Checks user credentials given to the provided form against database.
     * @returns A promise wrapping a boolean indicating whether given login
     * data authenticates provided login.
     */_createClass(LoginComponent,[{key:'login',value:function(){var _ref6=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee6(){return regeneratorRuntime.wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:if(this._data.remoteConnection){_context6.next=2;break}return _context6.abrupt('return');case 2:this.errorMessage='';_context6.prev=3;_context6.next=6;return this._authentication.login(this.password,this.loginName);case 6:_context6.next=12;break;case 8:_context6.prev=8;_context6.t0=_context6['catch'](3);if(_context6.t0.hasOwnProperty('message'))this.errorMessage=_context6.t0.message;else this.errorMessage=this._representObject(_context6.t0);return _context6.abrupt('return');case 12:this.errorMessage='';this._router.navigateByUrl(this._authentication.lastRequestedURL||'/');case 14:case'end':return _context6.stop();}}},_callee6,this,[[3,8]])}));function login(){return _ref6.apply(this,arguments)}return login}()}]);return LoginComponent}(),(_descriptor=_applyDecoratedDescriptor(_class6.prototype,'loginButtonLabel',[_dec4],{enumerable:true,initializer:function initializer(){return'login'}}),_descriptor2=_applyDecoratedDescriptor(_class6.prototype,'loginLabel',[_dec5],{enumerable:true,initializer:function initializer(){return'Login'}}),_descriptor3=_applyDecoratedDescriptor(_class6.prototype,'passwordLabel',[_dec6],{enumerable:true,initializer:function initializer(){return'Password'}})),_class6))||_class5);// endregion
// region module
// IgnoreTypeCheck
(0,_core.Inject)(_core.PLATFORM_ID)(LoginComponent,null,3);Reflect.defineMetadata('design:paramtypes',[AuthenticationService,AuthenticationGuard,_angularGeneric.DataService,String,_router.Router,_angularGeneric.RepresentObjectPipe,_angularGeneric.ToolsService],LoginComponent);/**
 * Bundles user specific stuff into an importable angular module.
 */var Module=(_dec7=(0,_core.NgModule)({declarations:(0,_angularGeneric.determineDeclarations)(module),exports:(0,_angularGeneric.determineExports)(module),imports:[_platformBrowser.BrowserModule.withServerTransition({appId:'generic-universal'}),_forms.FormsModule,_angularGeneric2.default,_material.MatButtonModule,_material.MatIconModule,_material.MatInputModule],providers:(0,_angularGeneric.determineProviders)(module)}),_dec7(_class8=function Module(){_classCallCheck(this,Module)})||_class8);// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
exports.default=Module;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ })
/******/ ]);
});