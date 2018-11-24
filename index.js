// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module angularUser */
'use strict'
/* !
    region header
    [Project page](http://torben.website/angularUser)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
/*
    NOTE: Default import is not yet support for angular's ahead of time
    compiler.
*/
import {
    DataService,
    InitialDataService,
    Module as GenericModule,
    RepresentObjectPipe,
    UtilityService
} from 'angular-generic'
import {defaultAnimation} from 'angular-generic/animation'
import {PlainObject, Tools} from 'clientnode'
import {isPlatformServer, Location} from '@angular/common'
import {
    APP_INITIALIZER,
    Component,
    /* eslint-disable no-unused-vars */
    Inject,
    /* eslint-enable no-unused-vars */
    Injectable,
    Injector,
    Input,
    NgModule,
    /* eslint-disable no-unused-vars */
    PLATFORM_ID
    /* eslint-enable no-unused-vars */
} from '@angular/core'
import {FormsModule} from '@angular/forms'
/*
    NOTE: We should not import directly from "@angular/material" to improve
    tree shaking results.
*/
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'
import {BrowserModule} from '@angular/platform-browser'
import {
    ActivatedRouteSnapshot,
    // CanActivate,
    // CanActivateChild,
    Router,
    RouterStateSnapshot
} from '@angular/router'
import * as PouchDBAuthenticationPlugin from 'pouchdb-authentication'
import {from, Observable} from 'rxjs'
// endregion
DataService.wrappableMethodNames.push('getSession', 'login', 'logout')
// region provider
/**
 * Adds a database authentication plugin.
 * @param data - Injected data service instance.
 * @returns Initializer function.
 */
export function dataAuthenticationInitializerFactory(
    data:DataService
):Function {
    // NOTE: We need this statement here to avoid having an typescript error.
    0
    return ():void => {
        data.database = data.database.plugin(
            PouchDBAuthenticationPlugin.default)
    }
}
// endregion
// region services
// IgnoreTypeCheck
@Injectable()
/**
 * A service to handle user sessions and their authentication.
 * @property static:loginPath - Defines which url should be used as login path.
 *
 * @property autoRoute - Route to login page on de-authentication. Only works
 * if "observeDatabaseDeauthentication" is set to "true".
 * @property configuration - Holds the configuration service instance.
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
    static loginPath:string = '/login'

    autoRoute:boolean = true
    configuration:PlainObject
    data:DataService
    databaseAuthenticationActive:boolean = false
    error:Error|null = null
    injector:Injector
    location:Location
    login:Function
    loginName:string|null = null
    loginNamesToDeauthenticate:Set<string> = new Set()
    loginNeeded:boolean = false
    loginPromise:Promise<PlainObject>
    observeDatabaseDeauthentication:boolean = true
    resolveLogin:Function
    session:PlainObject|null = null
    unauthorizedCallback:Function = Tools.noop

    _lastRequestedURL:string = '/'
    /**
     * Saves needed services in instance properties.
     * @param initialData - Injected initial data service instance.
     * @param data - Injected data service instance.
     * @param injector - Injected injector service instance.
     * @param location - Injected location service instance.
     * @returns Nothing.
     */
    constructor(
        initialData:InitialDataService,
        data:DataService,
        injector:Injector,
        location:Location
    ) {
        this.data = data
        this.configuration = initialData.configuration
        this.injector = injector
        this.location = location
        this.login = async (
            password:string = 'readonlymember', login:string = 'readonlymember'
        ):Promise<boolean> => {
            this.loginName = null
            if (this.loginNamesToDeauthenticate.has(login))
                return false
            let result:boolean = await this.data.remoteConnection.login(
                login, password)
            if (result) {
                this.loginName = login
                /*
                    NOTE: pouchdb-server backend's needs to get login data for
                    each request to workaround internal bug:
                    https://github.com/pouchdb/pouchdb-server/issues/308.
                */
                this.configuration.database.connector.auth = {
                    username: this.loginName,
                    password
                }
                await this.data.initializeConnection()
                return true
            }
            return false
        }
        this.loginPromise = new Promise((resolve:Function):void => {
            this.resolveLogin = resolve
        })
        if (this.observeDatabaseDeauthentication)
            this.data.initialized.subscribe(():void => {
                const router:Router = this.injector.get(Router)
                this.data.addErrorCallback(async (
                    error:any, ...additionalParameter:Array<any>
                ):Promise<boolean|void> => {
                    if (
                        error.hasOwnProperty('name') &&
                        error.name === 'unauthorized' ||
                        error.hasOwnProperty('error') &&
                        error.error === 'unauthorized'
                    ) {
                        this.databaseAuthenticationActive = false
                        this.loginName = null
                        await this.data.stopSynchronisation()
                        const result:any = this.unauthorizedCallback(
                            error, ...additionalParameter)
                        if (
                            typeof result === 'object' &&
                            result !== null &&
                            'then' in result
                        )
                            await result
                        if (this.autoRoute)
                            router.navigate([
                                AuthenticationService.loginPath])
                    }
                })
                /*
                    NOTE: Prevent resolving guard requests to be resolved
                    during de-authentication.
                */
                this.data.register('login', ():void => {
                    this.loginNeeded = false
                }, 'pre')
                this.data.register('logout', ():void => {
                    this.loginNeeded = true
                }, 'pre')
                this.data.register('logout', async (
                    result:any
                ):Promise<any> => {
                    this.lastRequestedURL = this.location.path(true)
                    result = await result
                    this.databaseAuthenticationActive = false
                    this.loginName = null
                    await this.data.stopSynchronisation()
                    return result
                })
            })
    }
    /**
     * Checks if current session can be authenticated.
     * @param autoRoute - Indicates whether a route change to login component
     * should be mate automatically if a de-authentication was detected.
     * @returns A promise with an indicating boolean inside.
     */
    async checkLogin(autoRoute:boolean|null = null):Promise<boolean> {
        if (this.loginNeeded) {
            this.lastRequestedURL = this.location.path(true)
            return false
        }
        if (!this.data.remoteConnection)
            return true
        if (autoRoute === null)
            autoRoute = this.autoRoute
        const router:Router = this.injector.get(Router)
        /*
            NOTE: We need to dynamically inject the router instance to resolve
            a cyclic dependency tree if this service is needed for a route
            guard.
        */
        this.session = null
        try {
            this.session = await this.data.remoteConnection.getSession()
        } catch (error) {
            this.loginName = null
            this.error = error
            this.lastRequestedURL = this.location.path(true)
            if (autoRoute)
                router.navigate([AuthenticationService.loginPath])
            return false
        }
        this.error = null
        if (this.session.userCtx.name) {
            if (
                this.loginNamesToDeauthenticate.has(
                    this.session.userCtx.name
                ) ||
                /*
                    NOTE: Pouchdb-server backend's needs to get login data for
                    each request to workaround internal bug:
                    https://github.com/pouchdb/pouchdb-server/issues/308.
                */
                !(
                    this.configuration.database.connector.auth &&
                    this.configuration.database.connector.auth.username &&
                    this.configuration.database.connector.auth.password
                )
            ) {
                this.loginName = null
                this.lastRequestedURL = this.location.path(true)
                if (autoRoute)
                    router.navigate([AuthenticationService.loginPath])
                return false
            }
            this.loginName = this.session.userCtx.name
            if (!this.databaseAuthenticationActive) {
                this.databaseAuthenticationActive = true
                await this.resolveLogin(this.session)
                await this.data.startSynchronisation()
                this.loginPromise = new Promise((resolve:Function):void => {
                    this.resolveLogin = resolve
                })
            }
            return true
        }
        this.loginName = null
        await this.data.stopSynchronisation()
        this.lastRequestedURL = this.location.path(true)
        if (autoRoute)
            router.navigate([AuthenticationService.loginPath])
        return false
    }
    /**
     * Simple getter for last requested url.
     * @returns Private's variable value.
     */
    get lastRequestedURL():string {
        return this._lastRequestedURL
    }
    /* eslint-disable flowtype/require-return-type */
    /**
     * @param url - New url to set as last requested url.
     * @returns Nothing.
     */
    set lastRequestedURL(url:string) {
        url = url.replace(/\/+/g, '/').replace(/\/$/, '')
        if (AuthenticationService.loginPath !== url)
            this._lastRequestedURL = url
    }
    /* eslint-enable flowtype/require-return-type */
}
// IgnoreTypeCheck
@Injectable()
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
export class AuthenticationGuard /* implements CanActivate, CanActivateChild*/ {
    static checkEachRouteActiviation:boolean = false
    static skipOnServer:boolean = true

    authentication:AuthenticationService
    data:DataService
    platformID:string
    /**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param platformID - Injected platform id token.
     * @returns Nothing.
     */
    constructor(
        authentication:AuthenticationService,
        // IgnoreTypeCheck
        @Inject(PLATFORM_ID) platformID:string
    ) {
        this.authentication = authentication
        this.platformID = platformID
    }
    /**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */
    canActivate(
        route:ActivatedRouteSnapshot, state:RouterStateSnapshot
    ):boolean|Observable<boolean> {
        if (
            AuthenticationGuard.skipOnServer &&
            isPlatformServer(this.platformID)
        )
            return true
        return from(this.checkLogin(state.url))
    }
    /**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */
    canActivateChild(
        route:ActivatedRouteSnapshot, state:RouterStateSnapshot
    ):boolean|Observable<boolean> {
        return this.canActivate(route, state)
    }
    /**
     * Checks if current session can be authenticated again given url.
     * @param url - New url to switch to.
     * @returns A promise with an indicating boolean inside.
     */
    async checkLogin(url:string|null = null):Promise<boolean> {
        if (
            this.authentication.loginName &&
            !AuthenticationGuard.checkEachRouteActiviation ||
            await this.authentication.checkLogin()
        )
            return true
        if (url)
            this.authentication.lastRequestedURL = url
        return false
    }
}
// endregion
// region components
// IgnoreTypeCheck
@Component({
    animations: [defaultAnimation],
    host: {
        '[@defaultAnimation]': '',
        '(window:keydown)':
            '$event.keyCode === keyCode.ENTER ? login() : null'
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
})
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
    @Input() errorMessage:string = ''
    keyCode:{[key:string]:number}
    @Input() loginName:string = ''
    @Input() loginButtonLabel:string = 'login'
    @Input() loginLabel:string = 'Login'
    @Input() password:string = ''
    @Input() passwordLabel:string = 'Password'

    _authentication:AuthenticationService
    _authenticationGuard:AuthenticationGuard
    _data:DataService
    _representObject:Function
    _router:Router
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
    constructor(
        authentication:AuthenticationService,
        data:DataService,
        @Inject(PLATFORM_ID) platformID:string,
        router:Router,
        representObjectPipe:RepresentObjectPipe,
        utility:UtilityService
    ) {
        this.keyCode = utility.fixed.tools.keyCode
        this._authentication = authentication
        // NOTE: Allow to pre-render the login page.
        if (!isPlatformServer(platformID))
            this._authentication.checkLogin().then((
                loggedIn:boolean
            ):void => {
                if (loggedIn)
                    this._router.navigateByUrl(
                        this._authentication.lastRequestedURL)
            })
        this._data = data
        this._representObject = representObjectPipe.transform.bind(
            representObjectPipe)
        this._router = router
    }
    /**
     * Checks user credentials given to the provided form against database.
     * @returns A promise wrapping a boolean indicating whether given login
     * data authenticates provided login.
     */
    async login():Promise<void> {
        if (!this._data.remoteConnection)
            return
        this.loginName = this.loginName.trim()
        this.password = this.password.trim()
        if (!(this.password && this.loginName)) {
            if (!(this.password || this.loginName))
                this.errorMessage = 'No credentials given.'
            else if (!this.password)
                this.errorMessage = 'No password given.'
            else if (!this.loginName)
                this.errorMessage = 'No login given.'
            return
        }
        this.errorMessage = ''
        try {
            await this._authentication.login(this.password, this.loginName)
        } catch (error) {
            if (error.hasOwnProperty('message'))
                this.errorMessage = error.message
            else
                this.errorMessage = this._representObject(error)
            return
        }
        this.errorMessage = ''
        this._router.navigateByUrl(this._authentication.lastRequestedURL)
    }
}
// endregion
// region module
// IgnoreTypeCheck
@NgModule({
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
        BrowserModule.withServerTransition({appId: 'generic-universal'}),
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
})
/**
 * Bundles user specific stuff into an importable angular module.
 */
export class Module {}
export default Module
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
