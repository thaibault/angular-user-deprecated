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
import GenericModule, {
    DataService, defaultAnimation, RepresentObjectPipe, ToolsService
} from 'angular-generic'
import type {PlainObject} from 'clientnode'
import {isPlatformServer} from '@angular/common'
import {
    /* eslint-disable no-unused-vars */
    Component, Inject, Injectable, Input, NgModule, PLATFORM_ID
    /* eslint-enable no-unused-vars */
} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MdButtonModule, MdIconModule, MdInputModule} from '@angular/material'
import {BrowserModule} from '@angular/platform-browser'
import {
    ActivatedRouteSnapshot, /* CanActivate, CanActivateChild,*/ Router,
    RouterStateSnapshot
} from '@angular/router'
import PouchDBAuthenticationPlugin from 'pouchdb-authentication'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
// NOTE: Only needed for debugging this file.
try {
    module.require('source-map-support/register')
} catch (error) {}
// endregion
const initialWrappableMethodNames:Array<string> =
    DataService.wrappableMethodNames.slice()
DataService.wrappableMethodNames.push('getSession', 'login', 'logout')
// IgnoreTypeCheck
@Injectable()
/**
 * A service to handle user sessions and their authentication.
 * @property static:databaseMethodNamesToIntercept - Database method names to
 * intercept for authenticated requests.
 *
 * @property data - Holds a database connection and helper methods.
 * @property error - Error object describing last failed authentication try.
 * @property login - Login method of current connection instance.
 * @property loginPromise - Promise describing currently running authentication
 * process.
 * @property resolveLogin - Function to resolve current login authentication
 * process.
 * @property observingDatabaseChanges - Indicates if each database change
 * should be intercept to deal with not authorized requests.
 */
export class AuthenticationService {
    static databaseMethodNamesToIntercept:Array<string> =
        initialWrappableMethodNames

    data:DataService
    error:?Error = null
    login:Function
    loginPromise:Promise<PlainObject>
    resolveLogin:Function
    observingDatabaseChanges:boolean = true
    /**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @returns Nothing.
     */
    constructor(data:DataService):void {
        this.data = data
        this.data.database = this.data.database.plugin(
            PouchDBAuthenticationPlugin)
        this.login = (
            password:string = 'readonlymember', login:string = 'readonlymember'
        ):Promise<boolean> =>
            this.data.remoteConnection.login(login, password)
        this.loginPromise = new Promise((resolve:Function):void => {
            this.resolveLogin = resolve
        })
        this.data.interceptSynchronisationPromise = this.loginPromise
    }
    /**
     * Checks if current session can be authenticated.
     * @param unauthorizedCallback - Function to call if an unauthorized
     * request happens.
     * @returns A promise with an indicating boolean inside.
     */
    async checkLogin(unauthorizedCallback:Function):Promise<boolean> {
        if (!this.data.remoteConnection)
            return true
        let session:PlainObject
        try {
            session = await this.data.remoteConnection.getSession()
        } catch (error) {
            this.error = error
            return false
        }
        this.error = null
        if (session.userCtx.name) {
            if (this.observingDatabaseChanges) {
                this.data.register(
                    this.constructor.databaseMethodNamesToIntercept, async (
                        result:any
                    ):Promise<any> => {
                        try {
                            result = await result
                        } catch (error) {
                            if (error.hasOwnProperty(
                                'name'
                            ) && error.name === 'unauthorized') {
                                if (this.data.synchronisation) {
                                    this.data.synchronisation.cancel()
                                    this.data.synchronisation = null
                                }
                                unauthorizedCallback(error, result)
                            } else
                                throw error
                        }
                        return result
                    })
                this.data.register('logout', async (
                    result:any
                ):Promise<any> => {
                    try {
                        result = await result
                    } catch (error) {
                        throw error
                    }
                    if (this.data.synchronisation) {
                        this.data.synchronisation.cancel()
                        this.data.synchronisation = null
                    }
                    return result
                })
            }
            await this.resolveLogin(session)
            let waitForSynchronisation:boolean = false
            if (this.data.synchronisation === null) {
                this.data.startSynchronisation()
                waitForSynchronisation = true
            }
            this.loginPromise = new Promise((resolve:Function):void => {
                this.resolveLogin = resolve
            })
            if (waitForSynchronisation)
                await new Promise((resolve:Function):void =>
                    this.data.synchronisation.on('pause', resolve))
            return true
        }
        if (this.data.synchronisation) {
            this.data.synchronisation.cancel()
            this.data.synchronisation = null
        }
        return false
    }
}
// IgnoreTypeCheck
@Injectable()
/**
 * A guard to intercept each route change and checkt for a valid authorisation
 * before.
 * @property static:loginPath - Defines which url should be used as login path.
 *
 * @property data - Holds a database connection and helper methods.
 * @property lastRequestedURL - Saves the last requested url before login to
 * redirect to after authentication was successful.
 * @property router - Holds the current router instance.
 */
export class AuthenticationGuard /* implements CanActivate, CanActivateChild*/ {
    static loginPath:string = '/login'

    authentication:AuthenticationService
    data:DataService
    lastRequestedURL:?string = null
    router:Router
    /**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param router - Router service.
     * @returns Nothing.
     */
    constructor(authentication:AuthenticationService, router:Router):void {
        this.authentication = authentication
        this.router = router
    }
    /**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */
    canActivate(
        route:ActivatedRouteSnapshot, state:RouterStateSnapshot
    ):Observable<boolean> {
        return Observable.fromPromise(this.checkLogin(state.url))
    }
    /**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */
    canActivateChild(
        route:ActivatedRouteSnapshot, state:RouterStateSnapshot
    ):Observable<boolean> {
        return this.canActivate(route, state)
    }
    /**
     * Checks if current session can be authenticated again given url.
     * @param url - New url to switch to.
     * @param autoRoute - Auto route to login page if authentication is not
     * valid.
     * @returns A promise with an indicating boolean inside.
     */
    async checkLogin(
        url:?string = null, autoRoute:boolean = true
    ):Promise<boolean> {
        if (await this.authentication.checkLogin(():void =>
            this.router.navigate([this.constructor.loginPath])
        ))
            return true
        if (url)
            this.lastRequestedURL = url
        if (autoRoute)
            this.router.navigate([this.constructor.loginPath])
        return false
    }
}
// IgnoreTypeCheck
@Component({
    animations: [defaultAnimation()],
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
        <md-input-container>
            <input mdInput [(ngModel)]="loginName" [placeholder]="loginLabel">
            <md-icon mdSuffix>account_circle</md-icon>
        </md-input-container>
        <md-input-container>
            <input
                mdInput
                [(ngModel)]="password"
                [placeholder]="passwordLabel"
                type="password"
            >
            <md-icon mdSuffix>lock</md-icon>
        </md-input-container>
        <button
            (click)="login()"
            @defaultAnimation
            md-raised-button
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
    errorMessage:string = ''
    keyCode:{[key:string]:number}
    loginName:?string
    @Input() loginButtonLabel:string = 'login'
    @Input() loginLabel:string = 'Login'
    password:?string
    @Input() passwordLabel:string = 'Password'

    _authentication:AuthenticationGuard
    _data:DataService
    _representObject:Function
    _router:Router
    /**
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
     */
    constructor(
        authentication:AuthenticationService,
        authenticationGuard:AuthenticationGuard, data:DataService,
        @Inject(PLATFORM_ID) platformID:string, router:Router,
        representObjectPipe:RepresentObjectPipe, tools:ToolsService
    ):void {
        this.keyCode = tools.tools.keyCode
        this._authentication = authentication
        this._authenticationGuard = authenticationGuard
        // NOTE: Allow to pre-render the login page.
        if (!isPlatformServer(platformID))
            this._authenticationGuard.checkLogin().then((
                loggedIn:boolean
            ):void => {
                if (loggedIn)
                    this._router.navigate(['/'])
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
        this._router.navigateByUrl(
            this._authenticationGuard.lastRequestedURL || '/')
    }
}
// region modules
const declarations:Array<Object> = Object.keys(module.exports).filter((
    name:string
):boolean => !name.startsWith('Abstract') && (
    name.endsWith('Component') || name.endsWith('Pipe')
)).map((name:string):Object => module.exports[name])
const providers:Array<Object> = Object.keys(module.exports).filter((
    name:string
):boolean => !name.startsWith('Abstract') && (
    name.endsWith('Resolver') || name.endsWith('Pipe') ||
    name.endsWith('Guard') || name.endsWith('Service')
)).map((name:string):Object => module.exports[name])
const modules:Array<Object> = [
    BrowserModule,
    FormsModule,
    GenericModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule
]
// IgnoreTypeCheck
@NgModule({
    declarations,
    exports: declarations,
    imports: modules,
    providers
})
/**
 * Bundles user specific stuff into an importable angular module.
 */
export default class Module {}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
