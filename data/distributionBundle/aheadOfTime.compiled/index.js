// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module angularUser */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataService, Module as GenericModule, RepresentObjectPipe, UtilityService } from 'angular-generic';
import { defaultAnimation } from 'angular-generic/animation';
import { Tools } from 'clientnode';
import { isPlatformServer, Location } from '@angular/common';
import { APP_INITIALIZER, Component, 
/* eslint-disable no-unused-vars */
Inject, 
/* eslint-enable no-unused-vars */
Injectable, Injector, Input, NgModule, 
/* eslint-disable no-unused-vars */
PLATFORM_ID
/* eslint-enable no-unused-vars */
 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { 
// CanActivate,
// CanActivateChild,
Router } from '@angular/router';
import * as PouchDBAuthenticationPlugin from 'pouchdb-authentication';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
// NOTE: Only needed for debugging this file.
try {
    require('source-map-support/register');
}
catch (error) { }
// endregion
DataService.wrappableMethodNames.push('getSession', 'login', 'logout');
// region provider
/**
 * Adds a database authentication plugin.
 * @param data - Injected data service instance.
 * @returns Initializer function.
 */
export function dataAuthenticationInitializerFactory(data) {
    /*
            NOTE: We need this statement here to avoid having an ugly typescript
            error.
        */
    2;
    return () => {
        data.database = data.database.plugin(PouchDBAuthenticationPlugin.default);
    };
}
// endregion
// region services
// IgnoreTypeCheck
/**
 * A service to handle user sessions and their authentication.
 * @property static:loginPath - Defines which url should be used as login path.
 *
 * @property autoRoute - Route to login page on de-authentication. Only works
 * if "observeDatabaseDeauthentication" is set to "true".
 * @property data - Holds a database connection and helper methods.
 * @property databaseAuthenticationActive - Indicates whether database
 * authentication is active.
 * @property error - Error object describing last failed authentication try.
 * @property injector - Injector service instance.
 * @property location - Hold the location service instance.
 * @property login - Login method of current connection instance.
 * @property loginName - Currently logged in user name.
 * @property loginNamesToDeauthenticate - Login names to de-authenticate.
 * @property loginNeeded - Indicates whether a authorisation is needed before
 * an authentication request should be performed. This flag ist needed to
 * provide consistent behavior after an explicit logout was performed and an
 * authentication request comes to a backend node which was not informed about
 * prior requested de-authentication requests.
 * @property loginPromise - Promise describing currently running authentication
 * process.
 * @property observeDatabaseDeauthentication - Indicates if each database
 * change should be intercept to deal with not authorized requests.
 * @property resolveLogin - Function to resolve current login authentication
 * process.
 * @property session - Current user session data.
 *
 * @property _lastRequestedURL - Saves the last requested url before login to
 * redirect to after authentication was successful.
 */
export class AuthenticationService {
    /**
         * Saves needed services in instance properties.
         * @param data - Injected data service instance.
         * @param injector - Injected injector service instance.
         * @param location - Injected location service instance.
         * @returns Nothing.
         */
    constructor(data, injector, location) {
        this.autoRoute = true;
        this.databaseAuthenticationActive = false;
        this.error = null;
        this.loginName = null;
        this.loginNamesToDeauthenticate = new Set();
        this.loginNeeded = false;
        this.observeDatabaseDeauthentication = true;
        this.session = null;
        this.unauthorizedCallback = Tools.noop;
        this._lastRequestedURL = '/';
        this.data = data;
        this.injector = injector;
        this.location = location;
        this.login = (password = 'readonlymember', login = 'readonlymember') => __awaiter(this, void 0, void 0, function* () {
            this.loginName = null;
            if (this.loginNamesToDeauthenticate.has(login))
                return false;
            let result = yield this.data.remoteConnection.login(login, password);
            if (result) {
                this.loginName = login;
                return true;
            }
            return false;
        });
        this.loginPromise = new Promise((resolve) => {
            this.resolveLogin = resolve;
        });
        if (this.observeDatabaseDeauthentication)
            this.data.initialized.subscribe(() => {
                const router = this.injector.get(Router);
                this.data.addErrorCallback((error, ...additionalParameter) => __awaiter(this, void 0, void 0, function* () {
                    if (error.hasOwnProperty('name') &&
                        error.name === 'unauthorized' ||
                        error.hasOwnProperty('error') &&
                            error.error === 'unauthorized') {
                        this.databaseAuthenticationActive = false;
                        this.loginName = null;
                        yield this.data.stopSynchronisation();
                        const result = this.unauthorizedCallback(error, ...additionalParameter);
                        if (typeof result === 'object' &&
                            result !== null &&
                            'then' in result)
                            yield result;
                        if (this.autoRoute)
                            router.navigate([
                                AuthenticationService.loginPath
                            ]);
                    }
                }));
                /*
                                    NOTE: Prevent resolving guard requests to be resolved
                                    during de-authentication.
                                */
                this.data.register('login', () => {
                    this.loginNeeded = false;
                }, 'pre');
                this.data.register('logout', () => {
                    this.loginNeeded = true;
                }, 'pre');
                this.data.register('logout', (result) => __awaiter(this, void 0, void 0, function* () {
                    this.lastRequestedURL = this.location.path(true);
                    result = yield result;
                    this.databaseAuthenticationActive = false;
                    this.loginName = null;
                    yield this.data.stopSynchronisation();
                    return result;
                }));
            });
    }
    /**
         * Checks if current session can be authenticated.
         * @param autoRoute - Indicates whether a route change to login component
         * should be mate automatically if a de-authentication was detected.
         * @returns A promise with an indicating boolean inside.
         */
    checkLogin(autoRoute = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loginNeeded)
                return false;
            if (!this.data.remoteConnection)
                return true;
            if (autoRoute === null)
                autoRoute = this.autoRoute;
            const router = this.injector.get(Router);
            /*
                        NOTE: We need to dynamically inject the router instance to resolve
                        a cyclic dependency tree if this service is needed for a route
                        guard.
                    */
            this.session = null;
            try {
                this.session = yield this.data.remoteConnection.getSession();
            }
            catch (error) {
                this.loginName = null;
                this.error = error;
                if (autoRoute)
                    router.navigate([AuthenticationService.loginPath]);
                return false;
            }
            this.error = null;
            if (this.session.userCtx.name) {
                if (this.loginNamesToDeauthenticate.has(this.session.userCtx.name)) {
                    this.loginName = null;
                    if (autoRoute)
                        router.navigate([AuthenticationService.loginPath]);
                    return false;
                }
                this.loginName = this.session.userCtx.name;
                if (!this.databaseAuthenticationActive) {
                    this.databaseAuthenticationActive = true;
                    yield this.resolveLogin(this.session);
                    yield this.data.startSynchronisation();
                    this.loginPromise = new Promise((resolve) => {
                        this.resolveLogin = resolve;
                    });
                }
                return true;
            }
            this.loginName = null;
            yield this.data.stopSynchronisation();
            this.lastRequestedURL = this.location.path(true);
            if (autoRoute)
                router.navigate([AuthenticationService.loginPath]);
            return false;
        });
    }
    /**
         * Simple getter for last requested url.
         * @returns Private's variable value.
         */
    get lastRequestedURL() {
        return this._lastRequestedURL;
    }
    /* eslint-disable flowtype/require-return-type */
    /**
         * @param url - New url to set as last requested url.
         * @returns Nothing.
         */
    set lastRequestedURL(url) {
        url = url.replace(/\/+/g, '/').replace(/\/$/, '');
        if (AuthenticationService.loginPath !== url)
            this._lastRequestedURL = url;
    }
}
AuthenticationService.loginPath = '/login';
AuthenticationService.decorators = [
    { type: Injectable },
];
/* eslint-enable flowtype/require-return-type */
/** @nocollapse */
AuthenticationService.ctorParameters = () => [
    { type: DataService, },
    { type: Injector, },
    { type: Location, },
];
// IgnoreTypeCheck
/**
 * A guard to intercept each route change and checkt for a valid authorisation
 * before.
 * @property static:checkEachRouteActiviation - Indicates whether each route
 * changes should trigger a request which tests a valid authentication.
 * @property static:skipOnServer - Indicates whether we should skip
 * an authentication request on server context.
 *
 * @property data - Holds a database connection and helper methods.
 */
export class AuthenticationGuard {
    /**
         * Saves needed services in instance properties.
         * @param authentication - Authentication service instance.
         * @param platformID - Injected platform id token.
         * @returns Nothing.
         */
    constructor(authentication, 
    // IgnoreTypeCheck
    platformID) {
        this.authentication = authentication;
        this.platformID = platformID;
    }
    /**
         * Checks if current session can be authenticated again given url.
         * @param route - Route to switch to.
         * @param state - New router state.
         * @returns A promise with an indicating boolean inside.
         */
    canActivate(route, state) {
        if (AuthenticationGuard.skipOnServer && isPlatformServer(this.platformID))
            return true;
        return Observable.fromPromise(this.checkLogin(state.url));
    }
    /**
         * Checks if current session can be authenticated again given url.
         * @param route - Route to switch to.
         * @param state - New router state.
         * @returns A promise with an indicating boolean inside.
         */
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
    /**
         * Checks if current session can be authenticated again given url.
         * @param url - New url to switch to.
         * @returns A promise with an indicating boolean inside.
         */
    checkLogin(url = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.authentication.loginName &&
                !AuthenticationGuard.checkEachRouteActiviation ||
                (yield this.authentication.checkLogin()))
                return true;
            if (url)
                this.authentication.lastRequestedURL = url;
            return false;
        });
    }
}
AuthenticationGuard.checkEachRouteActiviation = false;
AuthenticationGuard.skipOnServer = true;
AuthenticationGuard.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AuthenticationGuard.ctorParameters = () => [
    { type: AuthenticationService, },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];
// endregion
// region components
// IgnoreTypeCheck
/**
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
 */
export class LoginComponent {
    /**
         * @param authentication - Holds an instance of the current authentication
         * service.
         * @param data - Holds the database service instance.
         * @param platformID - Platform identification string.
         * @param router - Holds the router instance.
         * @param representObjectPipe - A reference to the represent object pipe.
         * @param utility - Injected utility service instance.
         * @returns Nothing.
         */
    constructor(authentication, data, platformID, router, representObjectPipe, utility) {
        this.errorMessage = '';
        this.loginName = '';
        this.loginButtonLabel = 'login';
        this.loginLabel = 'Login';
        this.password = '';
        this.passwordLabel = 'Password';
        this.keyCode = utility.fixed.tools.keyCode;
        this._authentication = authentication;
        // NOTE: Allow to pre-render the login page.
        if (!isPlatformServer(platformID))
            this._authentication.checkLogin().then((loggedIn) => {
                if (loggedIn)
                    this._router.navigateByUrl(this._authentication.lastRequestedURL);
            });
        this._data = data;
        this._representObject = representObjectPipe.transform.bind(representObjectPipe);
        this._router = router;
    }
    /**
         * Checks user credentials given to the provided form against database.
         * @returns A promise wrapping a boolean indicating whether given login
         * data authenticates provided login.
         */
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._data.remoteConnection)
                return;
            this.loginName = this.loginName.trim();
            this.password = this.password.trim();
            if (!(this.password && this.loginName)) {
                if (!(this.password || this.loginName))
                    this.errorMessage = 'No credentials given.';
                else if (!this.password)
                    this.errorMessage = 'No password given.';
                else if (!this.loginName)
                    this.errorMessage = 'No login given.';
                return;
            }
            this.errorMessage = '';
            try {
                yield this._authentication.login(this.password, this.loginName);
            }
            catch (error) {
                if (error.hasOwnProperty('message'))
                    this.errorMessage = error.message;
                else
                    this.errorMessage = this._representObject(error);
                return;
            }
            this.errorMessage = '';
            this._router.navigateByUrl(this._authentication.lastRequestedURL);
        });
    }
}
LoginComponent.decorators = [
    { type: Component, args: [{
                animations: [defaultAnimation],
                host: {
                    '[@defaultAnimation]': '',
                    '(window:keydown)': '$event.keyCode === keyCode.ENTER ? login() : null'
                },
                selector: 'login',
                template: `
        <div class="message" @defaultAnimation *ngIf="errorMessage">
            {{errorMessage}}
        </div>
        <mat-form-field>
            <input
                matInput
                [ngModel]="loginName"
                (ngModelChange)="errorMessage = ''; loginName = $event"
                [placeholder]="loginLabel"
            >
            <mat-icon matSuffix>account_circle</mat-icon>
        </mat-form-field>
        <mat-form-field>
            <input
                matInput
                [ngModel]="password"
                (ngModelChange)="errorMessage = ''; password = $event"
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
    `
            },] },
];
/** @nocollapse */
LoginComponent.ctorParameters = () => [
    { type: AuthenticationService, },
    { type: DataService, },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: Router, },
    { type: RepresentObjectPipe, },
    { type: UtilityService, },
];
LoginComponent.propDecorators = {
    "errorMessage": [{ type: Input },],
    "loginName": [{ type: Input },],
    "loginButtonLabel": [{ type: Input },],
    "loginLabel": [{ type: Input },],
    "password": [{ type: Input },],
    "passwordLabel": [{ type: Input },],
};
// endregion
// region module
// IgnoreTypeCheck
/**
 * Bundles user specific stuff into an importable angular module.
 */
export class Module {
}
Module.decorators = [
    { type: NgModule, args: [{
                /*
                        NOTE: Running "angularGeneric.moduleHelper.determineDeclarations()" is
                        not yet supported by the AOT-Compiler.
                    */
                declarations: [LoginComponent],
                /*
                        NOTE: Running "angularGeneric.moduleHelper.determineExports()" is not
                        yet supported by the AOT-Compiler.
                    */
                exports: [LoginComponent],
                imports: [
                    BrowserModule.withServerTransition({ appId: 'generic-universal' }),
                    FormsModule,
                    GenericModule,
                    MatButtonModule,
                    MatIconModule,
                    MatInputModule
                ],
                /*
                        NOTE: Running "angularGeneric.moduleHelper.determineProviders()" is not
                        yet supported by the AOT-Compiler.
                    */
                providers: [
                    AuthenticationGuard,
                    AuthenticationService,
                    {
                        deps: [DataService],
                        multi: true,
                        provide: APP_INITIALIZER,
                        useFactory: dataAuthenticationInitializerFactory
                    }
                ]
            },] },
];
/** @nocollapse */
Module.ctorParameters = () => [];
export default Module;
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
