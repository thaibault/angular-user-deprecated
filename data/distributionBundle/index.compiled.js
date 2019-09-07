'use strict';
(function(a,b){'object'==typeof exports&&'object'==typeof module?module.exports=b(require('@angular/material/button'),require('angular-generic'),require('angular-generic/animation.compiled'),require('clientnode'),require('@angular/common'),require('@angular/core'),require('@angular/forms'),require('@angular/material/icon'),require('@angular/material/input'),require('@angular/platform-browser'),require('@angular/router'),require('pouchdb-authentication'),require('rxjs/Observable'),require('rxjs/add/observable/fromPromise'),function(){try{return require('source-map-support/register')}catch(a){}}()):'function'==typeof define&&define.amd?define('angular-user',['@angular/material/button','angular-generic','angular-generic/animation.compiled','clientnode','@angular/common','@angular/core','@angular/forms','@angular/material/icon','@angular/material/input','@angular/platform-browser','@angular/router','pouchdb-authentication','rxjs/Observable','rxjs/add/observable/fromPromise','source-map-support/register'],b):'object'==typeof exports?exports['angular-user']=b(require('@angular/material/button'),require('angular-generic'),require('angular-generic/animation.compiled'),require('clientnode'),require('@angular/common'),require('@angular/core'),require('@angular/forms'),require('@angular/material/icon'),require('@angular/material/input'),require('@angular/platform-browser'),require('@angular/router'),require('pouchdb-authentication'),require('rxjs/Observable'),require('rxjs/add/observable/fromPromise'),function(){try{return require('source-map-support/register')}catch(a){}}()):a['angular-user']=b(a['@angular/material/button'],a['angular-generic'],a['angular-generic/animation.compiled'],a.clientnode,a['@angular/common'],a['@angular/core'],a['@angular/forms'],a['@angular/material/icon'],a['@angular/material/input'],a['@angular/platform-browser'],a['@angular/router'],a['pouchdb-authentication'],a['rxjs/Observable'],a['rxjs/add/observable/fromPromise'],a['source-map-support/register'])})('undefined'==typeof self?this:self,function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=0)}([function(a,b,c){a.exports=c(1)},function(a,b,c){'use strict';function i(e,a,b,c){b&&Object.defineProperty(e,a,{enumerable:b.enumerable,configurable:b.configurable,writable:b.writable,value:b.initializer?b.initializer.call(c):void 0})}function d(g,a,b,c,d){var e={};return Object.keys(c).forEach(function(b){e[b]=c[b]}),e.enumerable=!!e.enumerable,e.configurable=!!e.configurable,('value'in e||e.initializer)&&(e.writable=!0),e=b.slice().reverse().reduce(function(b,c){return c(g,a,b)||b},e),d&&void 0!==e.initializer&&(e.value=e.initializer?e.initializer.call(d):void 0,e.initializer=void 0),void 0===e.initializer&&(Object.defineProperty(g,a,e),e=null),e}function f(c){return function(){var a=c.apply(this,arguments);return new Promise(function(b,e){function c(d,i){try{var f=a[d](i),g=f.value}catch(b){return void e(b)}return f.done?void b(g):Promise.resolve(g).then(function(b){c('next',b)},function(b){c('throw',b)})}return c('next')})}}function j(c,a){if(!(c instanceof a))throw new TypeError('Cannot call a class as a function')}function e(b){return 2,function(){b.database=b.database.plugin(V.default)}}var g,h,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(b){return typeof b}:function(b){return b&&'function'==typeof Symbol&&b.constructor===Symbol&&b!==Symbol.prototype?'symbol':typeof b},I=function(){function e(e,f){for(var b,c=0;c<f.length;c++)b=f[c],b.enumerable=b.enumerable||!1,b.configurable=!0,'value'in b&&(b.writable=!0),Object.defineProperty(e,b.key,b)}return function(a,b,c){return b&&e(a.prototype,b),c&&e(a,c),a}}();b.__esModule=!0,b.Module=b.LoginComponent=b.AuthenticationGuard=b.AuthenticationService=void 0,b.dataAuthenticationInitializerFactory=e;var J=c(2),K=c(3),L=c(4),M=c(5),N=c(6),O=c(7),P=c(8),Q=c(9),R=c(10),S=c(11),T=c(12),U=c(13),V=function(d){if(d&&d.__esModule)return d;var a={};if(null!=d)for(var b in d)Object.prototype.hasOwnProperty.call(d,b)&&(a[b]=d[b]);return a.default=d,a}(U),W=c(14);c(15);try{c(16)}catch(b){}J.DataService.wrappableMethodNames.push('getSession','login','logout');var X=b.AuthenticationService=(g=(0,N.Injectable)(),g(h=(l=k=function(){function h(a,b,c){var k=this;j(this,h),this.autoRoute=!0,this.data=this.data,this.databaseAuthenticationActive=!1,this.error=null,this.injector=this.injector,this.location=this.location,this.login=this.login,this.loginName=null,this.loginNamesToDeauthenticate=new Set,this.loginNeeded=!1,this.loginPromise=this.loginPromise,this.observeDatabaseDeauthentication=!0,this.resolveLogin=this.resolveLogin,this.session=null,this.unauthorizedCallback=L.Tools.noop,this._lastRequestedURL='/',this.data=a,this.injector=b,this.location=c,this.login=function(){var b=f(regeneratorRuntime.mark(function e(){var f,g=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'readonlymember',c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'readonlymember';return regeneratorRuntime.wrap(function(d){for(;;)switch(d.prev=d.next){case 0:if(k.loginName=null,!k.loginNamesToDeauthenticate.has(c)){d.next=3;break}return d.abrupt('return',!1);case 3:return d.next=5,k.data.remoteConnection.login(c,g);case 5:if(f=d.sent,!f){d.next=9;break}return k.loginName=c,d.abrupt('return',!0);case 9:return d.abrupt('return',!1);case 10:case'end':return d.stop();}},e,k)}));return function(){return b.apply(this,arguments)}}(),this.loginPromise=new Promise(function(b){k.resolveLogin=b}),this.observeDatabaseDeauthentication&&this.data.initialized.subscribe(function(){var a=k.injector.get(T.Router);k.data.addErrorCallback(function(){var b=f(regeneratorRuntime.mark(function b(e){for(var c=arguments.length,d=Array(1<c?c-1:0),f=1;f<c;f++)d[f-1]=arguments[f];var g;return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(!(e.hasOwnProperty('name')&&'unauthorized'===e.name||e.hasOwnProperty('error')&&'unauthorized'===e.error)){b.next=10;break}return k.databaseAuthenticationActive=!1,k.loginName=null,b.next=5,k.data.stopSynchronisation();case 5:if(g=k.unauthorizedCallback.apply(k,[e].concat(d)),!('object'===('undefined'==typeof g?'undefined':H(g))&&null!==g&&'then'in g)){b.next=9;break}return b.next=9,g;case 9:k.autoRoute&&a.navigate([h.loginPath]);case 10:case'end':return b.stop();}},b,k)}));return function(){return b.apply(this,arguments)}}()),k.data.register('login',function(){k.loginNeeded=!1},'pre'),k.data.register('logout',function(){k.loginNeeded=!0},'pre'),k.data.register('logout',function(){var b=f(regeneratorRuntime.mark(function c(d){return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return k.lastRequestedURL=k.location.path(!0),b.next=3,d;case 3:return d=b.sent,k.databaseAuthenticationActive=!1,k.loginName=null,b.next=8,k.data.stopSynchronisation();case 8:return b.abrupt('return',d);case 9:case'end':return b.stop();}},c,k)}));return function(){return b.apply(this,arguments)}}())})}return h.prototype.checkLogin=function(){var a=f(regeneratorRuntime.mark(function a(){var f,b=this,c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(!this.loginNeeded){a.next=2;break}return a.abrupt('return',!1);case 2:if(this.data.remoteConnection){a.next=4;break}return a.abrupt('return',!0);case 4:return null===c&&(c=this.autoRoute),f=this.injector.get(T.Router),this.session=null,a.prev=7,a.next=10,this.data.remoteConnection.getSession();case 10:this.session=a.sent,a.next=19;break;case 13:return a.prev=13,a.t0=a['catch'](7),this.loginName=null,this.error=a.t0,c&&f.navigate([h.loginPath]),a.abrupt('return',!1);case 19:if(this.error=null,!this.session.userCtx.name){a.next=34;break}if(!this.loginNamesToDeauthenticate.has(this.session.userCtx.name)){a.next=25;break}return this.loginName=null,c&&f.navigate([h.loginPath]),a.abrupt('return',!1);case 25:if(this.loginName=this.session.userCtx.name,this.databaseAuthenticationActive){a.next=33;break}return this.databaseAuthenticationActive=!0,a.next=30,this.resolveLogin(this.session);case 30:return a.next=32,this.data.startSynchronisation();case 32:this.loginPromise=new Promise(function(c){b.resolveLogin=c});case 33:return a.abrupt('return',!0);case 34:return this.loginName=null,a.next=37,this.data.stopSynchronisation();case 37:return this.lastRequestedURL=this.location.path(!0),c&&f.navigate([h.loginPath]),a.abrupt('return',!1);case 40:case'end':return a.stop();}},a,this,[[7,13]])}));return function(){return a.apply(this,arguments)}}(),I(h,[{key:'lastRequestedURL',get:function(){return this._lastRequestedURL},set:function(a){a=a.replace(/\/+/g,'/').replace(/\/$/,''),h.loginPath!==a&&(this._lastRequestedURL=a)}}]),h}(),k.loginPath='/login',l))||h);Reflect.defineMetadata('design:paramtypes',[J.DataService,N.Injector,M.Location],X);var Y=b.AuthenticationGuard=(m=(0,N.Injectable)(),m(n=(p=o=function(){function d(a,b){j(this,d),this.authentication=this.authentication,this.data=this.data,this.platformID=this.platformID,this.authentication=a,this.platformID=b}return d.prototype.canActivate=function(a,b){return!!(d.skipOnServer&&(0,M.isPlatformServer)(this.platformID))||W.Observable.fromPromise(this.checkLogin(b.url))},d.prototype.canActivateChild=function(c,a){return this.canActivate(c,a)},d.prototype.checkLogin=function(){var a=f(regeneratorRuntime.mark(function a(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(a.t0=this.authentication.loginName&&!d.checkEachRouteActiviation,a.t0){a.next=5;break}return a.next=4,this.authentication.checkLogin();case 4:a.t0=a.sent;case 5:if(!a.t0){a.next=7;break}return a.abrupt('return',!0);case 7:return e&&(this.authentication.lastRequestedURL=e),a.abrupt('return',!1);case 9:case'end':return a.stop();}},a,this)}));return function(){return a.apply(this,arguments)}}(),d}(),o.checkEachRouteActiviation=!1,o.skipOnServer=!0,p))||n);(0,N.Inject)(N.PLATFORM_ID)(Y,null,1),Reflect.defineMetadata('design:paramtypes',[X,String],Y);var Z=b.LoginComponent=(q=(0,N.Component)({animations:[K.defaultAnimation],host:{"[@defaultAnimation]":'',"(window:keydown)":'$event.keyCode === keyCode.ENTER ? login() : null'},selector:'login',template:'\n        <div class="message" @defaultAnimation *ngIf="errorMessage">\n            {{errorMessage}}\n        </div>\n        <mat-form-field>\n            <input\n                matInput\n                [ngModel]="loginName"\n                (ngModelChange)="errorMessage = \'\'; loginName = $event"\n                [placeholder]="loginLabel"\n            >\n            <mat-icon matSuffix>account_circle</mat-icon>\n        </mat-form-field>\n        <mat-form-field>\n            <input\n                matInput\n                [ngModel]="password"\n                (ngModelChange)="errorMessage = \'\'; password = $event"\n                [placeholder]="passwordLabel"\n                type="password"\n            >\n            <mat-icon matSuffix>lock</mat-icon>\n        </mat-form-field>\n        <button\n            (click)="login()"\n            @defaultAnimation\n            mat-raised-button\n            *ngIf="loginName && password"\n        >{{loginButtonLabel}}</button>\n    '}),r=(0,N.Input)(),s=(0,N.Input)(),t=(0,N.Input)(),u=(0,N.Input)(),v=(0,N.Input)(),w=(0,N.Input)(),q(x=(y=function(){function k(a,b,c,d,e,f){var g=this;j(this,k),i(this,'errorMessage',z,this),this.keyCode=this.keyCode,i(this,'loginName',A,this),i(this,'loginButtonLabel',B,this),i(this,'loginLabel',C,this),i(this,'password',D,this),i(this,'passwordLabel',E,this),this._authentication=this._authentication,this._authenticationGuard=this._authenticationGuard,this._data=this._data,this._representObject=this._representObject,this._router=this._router,this.keyCode=f.fixed.tools.keyCode,this._authentication=a,(0,M.isPlatformServer)(c)||this._authentication.checkLogin().then(function(b){b&&g._router.navigateByUrl(g._authentication.lastRequestedURL)}),this._data=b,this._representObject=e.transform.bind(e),this._router=d}return k.prototype.login=function(){var b=f(regeneratorRuntime.mark(function b(){return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:if(this._data.remoteConnection){b.next=2;break}return b.abrupt('return');case 2:if(this.loginName=this.loginName.trim(),this.password=this.password.trim(),this.password&&this.loginName){b.next=7;break}return this.password||this.loginName?this.password?!this.loginName&&(this.errorMessage='No login given.'):this.errorMessage='No password given.':this.errorMessage='No credentials given.',b.abrupt('return');case 7:return this.errorMessage='',b.prev=8,b.next=11,this._authentication.login(this.password,this.loginName);case 11:b.next=17;break;case 13:return b.prev=13,b.t0=b['catch'](8),this.errorMessage=b.t0.hasOwnProperty('message')?b.t0.message:this._representObject(b.t0),b.abrupt('return');case 17:this.errorMessage='',this._router.navigateByUrl(this._authentication.lastRequestedURL);case 19:case'end':return b.stop();}},b,this,[[8,13]])}));return function(){return b.apply(this,arguments)}}(),k}(),z=d(y.prototype,'errorMessage',[r],{enumerable:!0,initializer:function(){return''}}),A=d(y.prototype,'loginName',[s],{enumerable:!0,initializer:function(){return''}}),B=d(y.prototype,'loginButtonLabel',[t],{enumerable:!0,initializer:function(){return'login'}}),C=d(y.prototype,'loginLabel',[u],{enumerable:!0,initializer:function(){return'Login'}}),D=d(y.prototype,'password',[v],{enumerable:!0,initializer:function(){return''}}),E=d(y.prototype,'passwordLabel',[w],{enumerable:!0,initializer:function(){return'Password'}}),y))||x);(0,N.Inject)(N.PLATFORM_ID)(Z,null,2),Reflect.defineMetadata('design:paramtypes',[X,J.DataService,String,T.Router,J.RepresentObjectPipe,J.UtilityService],Z);var $=b.Module=(F=(0,N.NgModule)({declarations:[Z],exports:[Z],imports:[S.BrowserModule.withServerTransition({appId:'generic-universal'}),O.FormsModule,J.Module,P.MatButtonModule,Q.MatIconModule,R.MatInputModule],providers:[Y,X,{deps:[J.DataService],multi:!0,provide:N.APP_INITIALIZER,useFactory:e}]}),F(G=function b(){j(this,b)})||G);b.default=$},function(a){a.exports=b},function(a){a.exports=c},function(a){a.exports=d},function(a){a.exports=e},function(a){a.exports=f},function(a){a.exports=g},function(b){b.exports=a},function(a){a.exports=h},function(a){a.exports=i},function(a){a.exports=j},function(a){a.exports=k},function(a){a.exports=l},function(a){a.exports=m},function(a){a.exports=n},function(a){if('undefined'==typeof o){var b=new Error('Cannot find module "source-map-support/register"');throw b.code='MODULE_NOT_FOUND',b}a.exports=o}])});