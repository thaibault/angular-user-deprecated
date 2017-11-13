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
    DataService, Module as GenericModule, RepresentObjectPipe, UtilityService
} from 'angular-generic'
import {defaultAnimation} from 'angular-generic/animation'
import {PlainObject} from 'clientnode'
import {isPlatformServer} from '@angular/common'
import {
    APP_INITIALIZER,
    ChangeDetectionStrategy,
    Component,
    /* eslint-disable no-unused-vars */
    Inject,
    /* eslint-enable no-unused-vars */
    Injectable,
    Input,
    NgModule,
    /* eslint-disable no-unused-vars */
    PLATFORM_ID
    /* eslint-enable no-unused-vars */
} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButtonModule, MatIconModule, MatInputModule} from '@angular/material'
import {BrowserModule} from '@angular/platform-browser'
import {
    ActivatedRouteSnapshot,
    // CanActivate,
    // CanActivateChild,
    Router,
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
// region provider
/**
 * Adds a database authentication plugin.
 * @param data - Injected data service instance.
 * @returns Initializer function.
 */
export function dataAuthenticationInitializerFactory(
    data:DataService
):Function {
    /*
        NOTE: We need this statement here to avoid having an ugly typescript
        error.
    */
    2
    return ():void => {
        data.database = data.database.plugin(PouchDBAuthenticationPlugin)
    }
}
// endregion
// region services
// IgnoreTypeCheck
@Injectable()
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
 * @property observingDatabaseChanges - Indicates if each database change
 * should be intercept to deal with not authorized requests.
 * @property resolveLogin - Function to resolve current login authentication
 * process.
 * @property session - Current user session data.
 */
export class AuthenticationService {
    static databaseMethodNamesToIntercept:Array<string> =
        initialWrappableMethodNames

    data:DataService
    error:Error|null = null
    lastRequestedURL:string|null = null
    login:Function
    loginName:string|null = null
    loginNamesToDeauthenticate:Set<string> = new Set()
    loginPromise:Promise<PlainObject>
    observingDatabaseChanges:boolean = true
    resolveLogin:Function
    session:PlainObject|null = null
    /**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @returns Nothing.
     */
    constructor(data:DataService) {
        this.data = data
        this.login = async (
            password:string = 'readonlymember', login:string = 'readonlymember'
        ):Promise<boolean> => {
            this.loginName = null
            if (this.loginNamesToDeauthenticate.has(login))
                return false
            let result:boolean
            try {
                result = await this.data.remoteConnection.login(
                    login, password)
            } catch (error) {
                throw error
            }
            if (result) {
                this.loginName = login
                return true
            }
            return false
        }
        this.loginPromise = new Promise((resolve:Function):void => {
            this.resolveLogin = resolve
        })
    }
    /**
     * Checks if current session can be authenticated.
     * @param unauthorizedCallback - Function to call if an unauthorized
     * request happens.
     * @returns A promise with an indicating boolean inside.
     */
    async checkLogin(unauthorizedCallback:Function = (
        error:Error, result:any
    ):any => result):Promise<boolean> {
        if (!this.data.remoteConnection)
            return true
        this.session = null
        try {
            this.session = await this.data.remoteConnection.getSession()
        } catch (error) {
            this.loginName = null
            this.error = error
            return false
        }
        this.error = null
        if (this.session.userCtx.name) {
            if (this.loginNamesToDeauthenticate.has(this.session.userCtx.name))
                return false
            this.loginName = this.session.userCtx.name
            if (this.observingDatabaseChanges) {
                this.data.register(
                    AuthenticationService.databaseMethodNamesToIntercept,
                    async (result:any):Promise<any> => {
                        try {
                            result = await result
                        } catch (error) {
                            if (
                                error.hasOwnProperty('name') &&
                                error.name === 'unauthorized'
                            ) {
                                this.loginName = null
                                await this.data.stopSynchronisation()
                                result = unauthorizedCallback(error, result)
                                if (
                                    typeof result === 'object' &&
                                    result !== null &&
                                    'then' in result
                                )
                                    result = await result
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
                    this.loginName = null
                    await this.data.stopSynchronisation()
                    return result
                })
            }
            await this.resolveLogin(this.session)
            await this.data.startSynchronisation()
            this.loginPromise = new Promise((resolve:Function):void => {
                this.resolveLogin = resolve
            })
            return true
        }
        this.loginName = null
        await this.data.stopSynchronisation()
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
 * @property router - Holds the current router instance.
 */
export class AuthenticationGuard /* implements CanActivate, CanActivateChild*/ {
    static loginPath:string = '/login'

    authentication:AuthenticationService
    data:DataService
    router:Router
    /**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param router - Router service.
     * @returns Nothing.
     */
    constructor(authentication:AuthenticationService, router:Router) {
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
        url:string|null = null, autoRoute:boolean = true
    ):Promise<boolean> {
        if (await this.authentication.checkLogin((
            error:Error, result:any
        ):any => {
            this.router.navigate([AuthenticationGuard.loginPath])
            return result
        }))
            return true
        if (url)
            this.authentication.lastRequestedURL = url
        if (autoRoute)
            this.router.navigate([AuthenticationGuard.loginPath])
        return false
    }
}
// endregion
// region components
// IgnoreTypeCheck
@Component({
    animations: [defaultAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    loginName:string = ''
    @Input() loginButtonLabel:string = 'login'
    @Input() loginLabel:string = 'Login'
    password:string = ''
    @Input() passwordLabel:string = 'Password'

    _authentication:AuthenticationService
    _authenticationGuard:AuthenticationGuard
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
     * @param utility - Injected utility service instance.
     * @returns Nothing.
     */
    constructor(
        authentication:AuthenticationService,
        authenticationGuard:AuthenticationGuard,
        data:DataService,
        @Inject(PLATFORM_ID) platformID:string,
        router:Router,
        representObjectPipe:RepresentObjectPipe,
        utility:UtilityService
    ) {
        this.keyCode = utility.fixed.tools.keyCode
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
            this._authentication.lastRequestedURL || '/')
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
