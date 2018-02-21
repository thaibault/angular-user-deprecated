import { DataService, RepresentObjectPipe, UtilityService } from 'angular-generic';
import { PlainObject } from 'clientnode';
import { Location } from '@angular/common';
import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
/**
 * Adds a database authentication plugin.
 * @param data - Injected data service instance.
 * @returns Initializer function.
 */
export declare function dataAuthenticationInitializerFactory(data: DataService): Function;
export declare class AuthenticationService {
    static loginPath: string;
    autoRoute: boolean;
    data: DataService;
    databaseAuthenticationActive: boolean;
    error: Error | null;
    injector: Injector;
    location: Location;
    login: Function;
    loginName: string | null;
    loginNamesToDeauthenticate: Set<string>;
    loginNeeded: boolean;
    loginPromise: Promise<PlainObject>;
    observeDatabaseDeauthentication: boolean;
    resolveLogin: Function;
    session: PlainObject | null;
    unauthorizedCallback: Function;
    _lastRequestedURL: string;
    /**
     * Saves needed services in instance properties.
     * @param data - Injected data service instance.
     * @param injector - Injected injector service instance.
     * @param location - Injected location service instance.
     * @returns Nothing.
     */
    constructor(data: DataService, injector: Injector, location: Location);
    /**
     * Checks if current session can be authenticated.
     * @param autoRoute - Indicates whether a route change to login component
     * should be mate automatically if a de-authentication was detected.
     * @returns A promise with an indicating boolean inside.
     */
    checkLogin(autoRoute?: boolean | null): Promise<boolean>;
    /**
     * Simple getter for last requested url.
     * @returns Private's variable value.
     */
    /**
     * @param url - New url to set as last requested url.
     * @returns Nothing.
     */
    lastRequestedURL: string;
}
export declare class AuthenticationGuard {
    static checkEachRouteActiviation: boolean;
    static skipOnServer: boolean;
    authentication: AuthenticationService;
    data: DataService;
    platformID: string;
    /**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param platformID - Injected platform id token.
     * @returns Nothing.
     */
    constructor(authentication: AuthenticationService, platformID: string);
    /**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>;
    /**
     * Checks if current session can be authenticated again given url.
     * @param route - Route to switch to.
     * @param state - New router state.
     * @returns A promise with an indicating boolean inside.
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>;
    /**
     * Checks if current session can be authenticated again given url.
     * @param url - New url to switch to.
     * @returns A promise with an indicating boolean inside.
     */
    checkLogin(url?: string | null): Promise<boolean>;
}
export declare class LoginComponent {
    errorMessage: string;
    keyCode: {
        [key: string]: number;
    };
    loginName: string;
    loginButtonLabel: string;
    loginLabel: string;
    password: string;
    passwordLabel: string;
    _authentication: AuthenticationService;
    _authenticationGuard: AuthenticationGuard;
    _data: DataService;
    _representObject: Function;
    _router: Router;
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
    constructor(authentication: AuthenticationService, data: DataService, platformID: string, router: Router, representObjectPipe: RepresentObjectPipe, utility: UtilityService);
    /**
     * Checks user credentials given to the provided form against database.
     * @returns A promise wrapping a boolean indicating whether given login
     * data authenticates provided login.
     */
    login(): Promise<void>;
}
export declare class Module {
}
export default Module;
