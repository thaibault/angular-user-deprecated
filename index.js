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
import {
    default as GenericModule, DataService, fadeAnimation, RepresentObjectPipe,
    ToolsService
} from 'angular-generic'
import type {PlainObject} from 'clientnode'
import {isPlatformServer} from '@angular/common'
import {
    Component, Inject, Injectable, NgModule, PLATFORM_ID
} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MdButtonModule, MdInputModule} from '@angular/material'
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
DataService.wrappableMethodNames.push('getSession', 'login', 'logout')
// IgnoreTypeCheck
@Injectable()
/**
 * A guard to intercept each route change and checkt for a valid authorisation
 * before.
 * @property data - Holds a database connection and helper methods.
 * @property error - Error object describing last failed authentication try.
 * @property lastRequestedURL - Saves the last requested url before login to
 * redirect to after authentication was successful.
 * @property logInPromise - Promise describing currently running authentication
 * process.
 * @property resolveLogin - Function to resolve current log in authentication
 * process.
 * @property observingDatabaseChanges - Indicates if each database change
 * should be intercept to deal with not authorized requests.
 * @property platformID - Platform identification string.
 * @property router - Holds the current router instance.
 */
export class AuthenticationGuard /* implements CanActivate, CanActivateChild*/ {
    data:DataService
    error:?Error = null
    lastRequestedURL:?string = null
    logInPromise:Promise<PlainObject>
    resolveLogin:Function
    observingDatabaseChanges:boolean = true
    platformID:string
    router:Router
    /**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @param platformID - Platform identification string.
     * @param router - Router service.
     * @returns Nothing.
     */
    constructor(
        data:DataService, @Inject(PLATFORM_ID) platformID:string, router:Router
    ):void {
        this.data = data
        this.data.database = this.data.database.plugin(
            PouchDBAuthenticationPlugin)
        this.logInPromise = new Promise((resolve:Function):void => {
            this.resolveLogin = resolve
        })
        this.data.interceptSynchronisationPromise = this.logInPromise
        this.platformID = platformID
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
        if (!this.data.remoteConnection)
            return true
        let session:PlainObject
        try {
            session = await this.data.remoteConnection.getSession()
        } catch (error) {
            this.error = error
            if (url)
                this.lastRequestedURL = url
            if (autoRoute)
                this.router.navigate(['/login'])
            return false
        }
        this.error = null
        if (session.userCtx.name) {
            if (this.observingDatabaseChanges) {
                this.data.register(['get', 'put', 'post', 'remove'], async (
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
                            this.router.navigate(['/login'])
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
            this.logInPromise = new Promise((resolve:Function):void => {
                this.resolveLogin = resolve
            })
            if (waitForSynchronisation)
                await new Promise((resolve:Function):void =>
                    this.data.synchronisation.on('pause', resolve))
            return true
        }
        if (url)
            this.lastRequestedURL = url
        if (this.data.synchronisation) {
            this.data.synchronisation.cancel()
            this.data.synchronisation = null
        }
        if (autoRoute)
            this.router.navigate(['/login'])
        return false
    }
}
// IgnoreTypeCheck
@Component({
    animations: [fadeAnimation()],
    host: {
        '[@fadeAnimation]': '',
        '(window:keydown)':
            '$event.keyCode === keyCode.ENTER ? performLogin() : null'
    },
    selector: 'login',
    template: `
        <div @fadeAnimation *ngIf="errorMessage">{{errorMessage}}</div>
        <md-input-container>
            <input mdInput placeholder="login" [(ngModel)]="login">
        </md-input-container>
        <md-input-container>
            <input
                mdInput type="password" placeholder="password"
                [(ngModel)]="password"
            >
        </md-input-container>
        <button
            @fadeAnimation *ngIf="login && password" md-raised-button
            (click)="performLogin()"
        >login</button>
    `
})
/**
 * A generic login component to fill user credentials into a form.
 * @property errorMessage - Holds a string representing an error message
 * representing the current authentication state.
 * @property keyCode - Mapping from key code to their description.
 * @property login - Holds given login.
 * @property password - Holds given password.
 * @property _authentication - The authentication guard service.
 * @property _data - The database service.
 * @property _representObject - A reference to the represent object pipe
 * transformation function.
 * @property _router - The router service.
 */
export class LoginComponent {
    errorMessage:string = ''
    keyCode:{[key:string]:number}
    login:?string
    password:?string
    _authentication:AuthenticationGuard
    _data:DataService
    _representObject:Function
    _router:Router
    /**
     * @param authentication - Holds an instance of the current authentication
     * guard.
     * @param data - Holds the database service instance.
     * @param platformID - Platform identification string.
     * @param router - Holds the router instance.
     * @param representObjectPipe - A reference to the represent object pipe.
     * @param tools - Tools kit.
     * @returns Nothing.
     */
    constructor(
        authentication:AuthenticationGuard, data:DataService,
        @Inject(PLATFORM_ID) platformID:string, router:Router,
        representObjectPipe:RepresentObjectPipe, tools:ToolsService
    ):void {
        this.keyCode = tools.tools.keyCode
        this._authentication = authentication
        // NOTE: Allow to pre-render the login page.
        if (!isPlatformServer(platformID))
            this._authentication.checkLogin().then((loggedIn:boolean):void => {
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
    async performLogin():Promise<void> {
        if (!this._data.remoteConnection)
            return
        this.errorMessage = ''
        try {
            await this._data.remoteConnection.login(this.login, this.password)
        } catch (error) {
            if (error.hasOwnProperty('message'))
                this.errorMessage = error.message
            else
                this.errorMessage = this._representObject(error)
            return
        }
        this.errorMessage = ''
        this._router.navigateByUrl(
            this._authentication.lastRequestedURL || '/')
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
