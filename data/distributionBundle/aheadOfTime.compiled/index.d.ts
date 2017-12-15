import { DataService, RepresentObjectPipe, UtilityService } from 'angular-generic';
import { PlainObject } from 'clientnode';
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
    static databaseMethodNamesToIntercept: Array<string>;
    data: DataService;
    error: Error | null;
    lastRequestedURL: string | null;
    login: Function;
    loginName: string | null;
    loginNamesToDeauthenticate: Set<string>;
    loginPromise: Promise<PlainObject>;
    observingDatabaseChanges: boolean;
    resolveLogin: Function;
    session: PlainObject | null;
    /**
     * Saves needed services in instance properties.
     * @param data - Data service.
     * @returns Nothing.
     */
    constructor(data: DataService);
    /**
     * Checks if current session can be authenticated.
     * @param unauthorizedCallback - Function to call if an unauthorized
     * request happens.
     * @returns A promise with an indicating boolean inside.
     */
    checkLogin(unauthorizedCallback?: Function): Promise<boolean>;
}
export declare class AuthenticationGuard {
    static loginPath: string;
    static skipOnServer: boolean;
    authentication: AuthenticationService;
    data: DataService;
    platformID: string;
    router: Router;
    /**
     * Saves needed services in instance properties.
     * @param authentication - Authentication service instance.
     * @param platformID - Injected platform id token.
     * @param router - Router service.
     * @returns Nothing.
     */
    constructor(authentication: AuthenticationService, platformID: string, router: Router);
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
     * @param autoRoute - Auto route to login page if authentication is not
     * valid.
     * @returns A promise with an indicating boolean inside.
     */
    checkLogin(url?: string | null, autoRoute?: boolean): Promise<boolean>;
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
     * @param authenticationGuard - Holds an instance of the current
     * authentication guard service.
     * @param data - Holds the database service instance.
     * @param platformID - Platform identification string.
     * @param router - Holds the router instance.
     * @param representObjectPipe - A reference to the represent object pipe.
     * @param utility - Injected utility service instance.
     * @returns Nothing.
     */
    constructor(authentication: AuthenticationService, authenticationGuard: AuthenticationGuard, data: DataService, platformID: string, router: Router, representObjectPipe: RepresentObjectPipe, utility: UtilityService);
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
