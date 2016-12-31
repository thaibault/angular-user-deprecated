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
    default as GenericModule, GenericDataService, GenericRepresentObjectPipe
} from 'angular-generic'
import type {PlainObject} from 'clientnode'
import {Component, Injectable, NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MaterialModule} from '@angular/material'
import {BrowserModule} from '@angular/platform-browser'
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router,
    RouterStateSnapshot
} from '@angular/router'
import PouchDBAuthenticationPlugin from 'pouchdb-authentication'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
// endregion
@Injectable()
/**
 * A guard to intercept each route change and checkt for a valid authorisation
 * before.
 * @property data - Holds a database connection and helper methods.
 * @property observingDatabaseChanges - Indicates if each database change
 * should be intercept to deal with not authorized requests.
 * @property router - Holds the current router instance.
 * @property lastRequestedURL - Saves the last requested url before login to
 * redirect to after authentication was successful.
 */
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    data:GenericDataService
    observingDatabaseChanges:boolean = false
    router:Router
    lastRequestedURL:?string = null
    /**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @param router - Router service.
     * @returns Nothing.
     */
    constructor(data:GenericDataService, router:Router):void {
        this.data = data
        this.data.database = this.data.database.plugin(
            PouchDBAuthenticationPlugin)
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
     * @returns A promise with an indicating boolean inside.
     */
    async checkLogin(url:?string = null):Promise<boolean> {
        let session:PlainObject
        try {
            session = await this.data.connection.getSession()
        } catch (error) {
            if (url)
                this.lastRequestedURL = url
            this.router.navigate(['/login'])
            return false
        }
        if (session.userCtx.name) {
            if (!this.observingDatabaseChanges)
                this.data.register(['get', 'put', 'post', 'remove'], async (
                    result:any
                ):Promise<any> => {
                    try {
                        result = await result
                    } catch (error) {
                        if (error.hasOwnProperty(
                            'name'
                        ) && error.name === 'unauthorized')
                            this.router.navigate(['/login'])
                        else
                            throw error
                    }
                    return result
                })
            return true
        }
        if (url)
            this.lastRequestedURL = url
        this.router.navigate(['/login'])
        return false
    }
}
@Component({
    selector: 'login',
    template: `
        <div *ngIf="errorMessage">{{errorMessage}}</div>
        <md-input placeholder="login" [(ngModel)]="login"></md-input>
        <md-input
            type="password" placeholder="password" [(ngModel)]="password">
        </md-input>
        <button md-raised-button (click)="performLogin()">login</button>
    `
})
/**
 * A generic login component to fill user credentials into a form.
 * @property _authentication - The authentication guard service.
 * @property _data - The database service.
 * @property _representObject - A reference to the represent object pipe
 * transformation function.
 * @property _router - The router service.
 * @property errorMessage - Holds a string representing an error message
 * representing the current authentication state.
 * @property login - Holds given login.
 * @property password - Holds given password.
 */
export class LoginComponent {
    _authentication:AuthenticationGuard
    _data:GenericDataService
    _representObject:Function
    _router:Router
    errorMessage:string = ''
    login:?string
    password:?string
    /**
     * @param authentication - Holds an instance of the current authentication
     * guard.
     * @param data - Holds the database service instance.
     * @param representObject - A reference to the represent object pipe.
     * @param router - Holds the router instance.
     * @returns Nothing.
     */
    constructor(
        authentication:AuthenticationGuard, data:GenericDataService,
        router:Router, representObject:GenericRepresentObjectPipe
    ):void {
        this._authentication = authentication
        this._authentication.checkLogin().then((loggedIn:boolean):void => {
            if (loggedIn)
                this._router.navigate(['/'])
        })
        this._data = data
        this._representObject = representObject.transform
        this._router = router
    }
    /**
     * Checks user credentials given to the provided form against database.
     * @returns A promise wrapping a boolean indicating weather given login
     * data authenticates provided login.
     */
    async performLogin():Promise<void> {
        this.errorMessage = ''
        try {
            await this._data.connection.login(this.login, this.password)
        } catch (error) {
            if (error.hasOwnProperty('message'))
                this.errorMessage = error.message
            else
                this.errorMessage = this._representObject(error)
            return
        }
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
    MaterialModule.forRoot()
]
@NgModule({
    declarations,
    exports: declarations,
    imports: modules,
    providers
})
/**
 * Bundles user specific stuff into an importable angular module.
 */
export default class UserModule {}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
