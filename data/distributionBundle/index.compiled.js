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
exports.__esModule=true;exports.default=exports.LoginComponent=exports.AuthenticationGuard=exports.AuthenticationService=undefined;var _dec,_class,_class2,_temp,_dec2,_class3,_class4,_temp2,_dec3,_dec4,_dec5,_dec6,_class5,_desc,_value,_class6,_descriptor,_descriptor2,_descriptor3,_dec7,_class8;var _angularGeneric=__webpack_require__(3);var _angularGeneric2=_interopRequireDefault(_angularGeneric);var _common=__webpack_require__(4);var _core=__webpack_require__(5);var _forms=__webpack_require__(6);var _material=__webpack_require__(7);var _platformBrowser=__webpack_require__(8);var _router=__webpack_require__(9);var _pouchdbAuthentication=__webpack_require__(10);var _pouchdbAuthentication2=_interopRequireDefault(_pouchdbAuthentication);var _Observable=__webpack_require__(11);__webpack_require__(12);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _initDefineProp(target,property,descriptor,context){if(!descriptor)return;Object.defineProperty(target,property,{enumerable:descriptor.enumerable,configurable:descriptor.configurable,writable:descriptor.writable,value:descriptor.initializer?descriptor.initializer.call(context):void 0})}function _applyDecoratedDescriptor(target,property,decorators,descriptor,context){var desc={};Object['ke'+'ys'](descriptor).forEach(function(key){desc[key]=descriptor[key]});desc.enumerable=!!desc.enumerable;desc.configurable=!!desc.configurable;if('value'in desc||desc.initializer){desc.writable=true}desc=decorators.slice().reverse().reduce(function(desc,decorator){return decorator(target,property,desc)||desc},desc);if(context&&desc.initializer!==void 0){desc.value=desc.initializer?desc.initializer.call(context):void 0;desc.initializer=undefined}if(desc.initializer===void 0){Object['define'+'Property'](target,property,desc);desc=null}return desc}function _initializerWarningHelper(descriptor,context){throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.')}function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}}return step('next')})}}// NOTE: Only needed for debugging this file.
try{module.require('source-map-support/register')}catch(error){}// endregion
const initialWrappableMethodNames=_angularGeneric.DataService.wrappableMethodNames.slice();_angularGeneric.DataService.wrappableMethodNames.push('getSession','login','logout');// region services
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
 */let AuthenticationService=exports.AuthenticationService=(_dec=(0,_core.Injectable)(),_dec(_class=(_temp=_class2=class AuthenticationService{/**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @returns Nothing.
     */constructor(data){var _this=this;this.data=this.data;this.error=null;this.lastRequestedURL=null;this.login=this.login;this.loginName=null;this.loginNamesToDeauthenticate=new Set;this.loginPromise=this.loginPromise;this.resolveLogin=this.resolveLogin;this.session=null;this.observingDatabaseChanges=true;this.data=data;// TODO too late to be respected for generic method interceptions.
this.data.database=this.data.database.plugin(_pouchdbAuthentication2.default);this.login=function(){var _ref=_asyncToGenerator(function*(password='readonlymember',login='readonlymember'){_this.loginName=null;if(_this.loginNamesToDeauthenticate.has(login))return false;let result;try{result=yield _this.data.remoteConnection.login(login,password)}catch(error){throw error}if(result){_this.loginName=login;return true}return false});return function(){return _ref.apply(this,arguments)}}();this.loginPromise=new Promise(function(resolve){_this.resolveLogin=resolve});this.data.interceptSynchronisationPromise=this.loginPromise}/**
     * Checks if current session can be authenticated.
     * @param unauthorizedCallback - Function to call if an unauthorized
     * request happens.
     * @returns A promise with an indicating boolean inside.
     */checkLogin(unauthorizedCallback=function(error,result){return result}){var _this2=this;return _asyncToGenerator(function*(){if(!_this2.data.remoteConnection)return true;_this2.session=null;try{_this2.session=yield _this2.data.remoteConnection.getSession()}catch(error){_this2.loginName=null;_this2.error=error;return false}_this2.error=null;if(_this2.session.userCtx.name){if(_this2.loginNamesToDeauthenticate.has(_this2.session.userCtx.name))return false;_this2.loginName=_this2.session.userCtx.name;if(_this2.observingDatabaseChanges){_this2.data.register(_this2.constructor.databaseMethodNamesToIntercept,function(){var _ref2=_asyncToGenerator(function*(result){try{result=yield result}catch(error){if(error.hasOwnProperty('name')&&error.name==='unauthorized'){_this2.loginName=null;if(_this2.data.synchronisation){_this2.data.synchronisation.cancel();_this2.data.synchronisation=null}result=unauthorizedCallback(error,result);if(typeof result==='object'&&result!==null&&'then'in result)result=yield result}else throw error}return result});return function(_x){return _ref2.apply(this,arguments)}}());_this2.data.register('logout',function(){var _ref3=_asyncToGenerator(function*(result){try{result=yield result}catch(error){throw error}_this2.loginName=null;if(_this2.data.synchronisation){_this2.data.synchronisation.cancel();_this2.data.synchronisation=null}return result});return function(_x2){return _ref3.apply(this,arguments)}}())}yield _this2.resolveLogin(_this2.session);let waitForSynchronisation=false;if(_this2.data.synchronisation===null){_this2.data.startSynchronisation();waitForSynchronisation=true}_this2.loginPromise=new Promise(function(resolve){_this2.resolveLogin=resolve});if(waitForSynchronisation)yield new Promise(function(resolve){return _this2.data.synchronisation.on('pause',resolve)});return true}_this2.loginName=null;if(_this2.data.synchronisation){_this2.data.synchronisation.cancel();_this2.data.synchronisation=null}return false})()}},_class2.databaseMethodNamesToIntercept=initialWrappableMethodNames,_temp))||_class);// IgnoreTypeCheck
Reflect.defineMetadata('design:paramtypes',[_angularGeneric.DataService],AuthenticationService);/**
 * A guard to intercept each route change and checkt for a valid authorisation
 * before.
 * @property static:loginPath - Defines which url should be used as login path.
 *
 * @property data - Holds a database connection and helper methods.
 * @property router - Holds the current router instance.
 */let AuthenticationGuard/* implements CanActivate, CanActivateChild*/=exports.AuthenticationGuard=(_dec2=(0,_core.Injectable)(),_dec2(_class3=(_temp2=_class4=class AuthenticationGuard{/**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param router - Router service.
     * @returns Nothing.
     */constructor(authentication,router){this.authentication=this.authentication;this.data=this.data;this.router=this.router;this.authentication=authentication;this.router=router}/**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */canActivate(route,state){return _Observable.Observable.fromPromise(this.checkLogin(state.url))}/**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */canActivateChild(route,state){return this.canActivate(route,state)}/**
     * Checks if current session can be authenticated again given url.
     * @param url - New url to switch to.
     * @param autoRoute - Auto route to login page if authentication is not
     * valid.
     * @returns A promise with an indicating boolean inside.
     */checkLogin(url=null,autoRoute=true){var _this3=this;return _asyncToGenerator(function*(){if(yield _this3.authentication.checkLogin(function(error,result){_this3.router.navigate([_this3.constructor.loginPath]);return result}))return true;if(url)_this3.authentication.lastRequestedURL=url;if(autoRoute)_this3.router.navigate([_this3.constructor.loginPath]);return false})()}},_class4.loginPath='/login',_temp2))||_class3);// endregion
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
 */let LoginComponent=exports.LoginComponent=(_dec3=(0,_core.Component)({animations:[(0,_angularGeneric.defaultAnimation)()],changeDetection:_core.ChangeDetectionStrategy.OnPush,host:{'[@defaultAnimation]':'','(window:keydown)':'$event.keyCode === keyCode.ENTER ? login() : null'},selector:'login',template:`
        <div class="message" @defaultAnimation *ngIf="errorMessage">
            {{errorMessage}}
        </div>
        <mat-form-field>
            <input matInput [(ngModel)]="loginName" [placeholder]="loginLabel">
            <mat-icon matSuffix>account_circle</mat-icon>
        </mat-form-field>
        <mat-form-field>
            <input
                matInput
                [(ngModel)]="password"
                [placeholder]="passwordLabel"
                type="password"
            >
            <mat-icon matSuffix>lock</mat-icon>
        </mat-form-field>
        <button
            (click)="login()"
            @defaultAnimation
            mat-raised-button
            *ngIf="loginName && password"
        >{{loginButtonLabel}}</button>
    `}),_dec4=(0,_core.Input)(),_dec5=(0,_core.Input)(),_dec6=(0,_core.Input)(),_dec3(_class5=(_class6=class LoginComponent{/**
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
     */constructor(authentication,authenticationGuard,data,platformID,router,representObjectPipe,tools){var _this4=this;this.errorMessage='';this.keyCode=this.keyCode;this.loginName=this.loginName;_initDefineProp(this,'loginButtonLabel',_descriptor,this);_initDefineProp(this,'loginLabel',_descriptor2,this);this.password=this.password;_initDefineProp(this,'passwordLabel',_descriptor3,this);this._authentication=this._authentication;this._data=this._data;this._representObject=this._representObject;this._router=this._router;this.keyCode=tools.tools.keyCode;this._authentication=authentication;this._authenticationGuard=authenticationGuard;// NOTE: Allow to pre-render the login page.
if(!(0,_common.isPlatformServer)(platformID))this._authenticationGuard.checkLogin().then(function(loggedIn){if(loggedIn)_this4._router.navigate(['/'])});this._data=data;this._representObject=representObjectPipe.transform.bind(representObjectPipe);this._router=router}/**
     * Checks user credentials given to the provided form against database.
     * @returns A promise wrapping a boolean indicating whether given login
     * data authenticates provided login.
     */login(){var _this5=this;return _asyncToGenerator(function*(){if(!_this5._data.remoteConnection)return;_this5.errorMessage='';try{yield _this5._authentication.login(_this5.password,_this5.loginName)}catch(error){if(error.hasOwnProperty('message'))_this5.errorMessage=error.message;else _this5.errorMessage=_this5._representObject(error);return}_this5.errorMessage='';_this5._router.navigateByUrl(_this5._authentication.lastRequestedURL||'/')})()}},(_descriptor=_applyDecoratedDescriptor(_class6.prototype,'loginButtonLabel',[_dec4],{enumerable:true,initializer:function initializer(){return'login'}}),_descriptor2=_applyDecoratedDescriptor(_class6.prototype,'loginLabel',[_dec5],{enumerable:true,initializer:function initializer(){return'Login'}}),_descriptor3=_applyDecoratedDescriptor(_class6.prototype,'passwordLabel',[_dec6],{enumerable:true,initializer:function initializer(){return'Password'}})),_class6))||_class5);// endregion
// region module
// IgnoreTypeCheck
(0,_core.Inject)(_core.PLATFORM_ID)(LoginComponent,null,3);Reflect.defineMetadata('design:paramtypes',[AuthenticationService,AuthenticationGuard,_angularGeneric.DataService,String,_router.Router,_angularGeneric.RepresentObjectPipe,_angularGeneric.ToolsService],LoginComponent);/**
 * Bundles user specific stuff into an importable angular module.
 */let Module=(_dec7=(0,_core.NgModule)({declarations:(0,_angularGeneric.determineDeclarations)(module),exports:(0,_angularGeneric.determineExports)(module),imports:[_platformBrowser.BrowserModule,_forms.FormsModule,_angularGeneric2.default,_material.MatButtonModule,_material.MatIconModule,_material.MatInputModule],providers:(0,_angularGeneric.determineProviders)(module)}),_dec7(_class8=class Module{})||_class8);// endregion
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