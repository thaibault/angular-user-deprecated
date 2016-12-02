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
    default as GenericModule, GenericDataService, GenericToolsService
} from 'angular-generic'
import Tools from 'clientnode'
import type {PlainObject} from 'clientnode'
import {Component, Injectable, NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MaterialModule} from '@angular/material'
import {BrowserModule} from '@angular/platform-browser'
import PouchDBAuthenticationPlugin from 'pouchdb-authentication'
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router,
    RouterStateSnapshot
} from '@angular/router'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
// endregion
@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    data:GenericDataService
    router:Router
    observingDatabaseChanges:boolean = false
    constructor(data:GenericDataService, router:Router):void {
        this.data = data
        this.data.database = this.data.database.plugin(
            PouchDBAuthenticationPlugin)
        this.router = router
    }
    canActivate(
        route:ActivatedRouteSnapshot, state:RouterStateSnapshot
    ):Observable<boolean> {
        return Observable.fromPromise(this.checkLogin(state.url))
    }
    canActivateChild(
        route:ActivatesRouteSnapshot, state: RouterStateSnapshot
    ):Observable<boolean> {
        return this.canActivate(route, state)
    }
    async checkLogin(url:string):Promise<boolean> {
        let session:PlainObject
        try {
            session = await this.data.connection.getSession()
        } catch (error) {
            this.router.navigate(['/login'])
            return false
        }
        if (session.userCtx.name) {
            if (!this.observingDatabaseChanges) {
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
            }
            this.router.navigate([url])
            return true
        }
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
export class LoginComponent {
    _authentication:AuthenticationGuard
    _data:GenericDataService
    _router:Router
    _tools:Tools
    errorMessage:string = ''
    login:?string
    password:?string
    constructor(
        authentication:AuthenticationGuard, data:GenericDataService,
        router:Router, tools:GenericToolsService
    ):void {
        if (authentication.checkLogin().then((loggedIn:boolean):void => {
            if (loggedIn)
                this._router.navigate(['/admin'])
        }))
        this._data = data
        this._router = router
        this._tools = tools.tools
    }
    async performLogin():Promise<void> {
        this.errorMessage = ''
        let result:PlainObject
        try {
            result = await this._data.connection.login(
                this.login, this.password)
        } catch (error) {
            if (error.hasOwnProperty('message'))
                this.errorMessage = error.message
            else
                this.errorMessage = this._tools.representObject(error)
            return
        }
        this._router.navigate(['/admin'])
    }
}
// region modules
const declarations:Array<Object> = Object.keys(module.exports).filter((
    name:string
):boolean => name.endsWith('Component') || name.endsWith('Pipe')).map((
    name:string
):Object => module.exports[name])
const providers:Array<Object> = Object.keys(module.exports).filter((
    name:string
):boolean =>
    name.endsWith('Resolver') || name.endsWith('Pipe') ||
    name.endsWith('Guard') || name.endsWith('Service')
).map((name:string):Object => module.exports[name])
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
export default class UserModule {}
// endregion
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
