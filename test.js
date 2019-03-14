// @flow
// #!/usr/bin/env node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import registerAngularTest from 'angular-generic/testRunner'
import type {PlainObject} from 'clientnode'
import PouchDBAdapterMemory from 'pouchdb-adapter-memory'
// endregion
registerAngularTest(function(
    ApplicationComponent:Object,
    roundType:string,
    targetTechnology:?string,
    $:any
):{bootstrap:Function;test:Function} {
    if (typeof localStorage !== 'undefined' && 'clear' in localStorage)
        localStorage.clear()
    // region imports 
    const {DataService} = require('angular-generic/service')
    const {
        getNativeEvent, LocationStub, RouterOutletStubComponent, RouterStub
    } = require('angular-generic/mockup')
    const {Location} = require('@angular/common')
    /* eslint-disable no-unused-vars */
    const {DebugElement} = require('@angular/core')
    /* eslint-enable no-unused-vars */
    const {ComponentFixture} = require('@angular/core/testing')
    const {By} = require('@angular/platform-browser')
    const {NoopAnimationsModule} = require(
        '@angular/platform-browser/animations')
    const {Router} = require('@angular/router')
    const index:Object = require('./index')
    const Module:Object = index.default
    const {AuthenticationGuard, AuthenticationService, LoginComponent} = index
    // endregion
    // region prepare services
    $.global.genericInitialData = {configuration: {database: {
        connector: {
            adapter: 'memory',
            auth: {
                username: 'test',
                password: 'test'
            }
        },
        plugins: [PouchDBAdapterMemory]
    }}}
    DataService.skipRemoteConnectionOnServer = false
    // endregion
    return {
        bootstrap: ():Object => ({
            declarations: [RouterOutletStubComponent],
            imports: [Module, NoopAnimationsModule],
            providers: [
                {provide: Location, useClass: LocationStub},
                {provide: Router, useClass: RouterStub}
            ]
        }),
        test: async function(TestBed:Object, roundType:string):Promise<void> {
            // region test services
            this.module(`Module.services (${roundType})`)
            // / region create mockups
            const authentication:AuthenticationService = TestBed.get(
                AuthenticationService)
            const data:DataService = TestBed.get(DataService)
            await data.initialize()
            let loggedInState:PlainObject = {resolve: 'test'}
            data.remoteConnection.getSession = async ():Promise<any> => (
                loggedInState.hasOwnProperty('resolve') ? Promise.resolve({
                    userCtx: {name: loggedInState.resolve}
                }) : Promise.reject(loggedInState.reject))
            let logInState:PlainObject = {resolve: true}
            let loginName:string
            let password:string
            data.remoteConnection.login = async (
                givenLogin:string, givenPassword:string
            ):Promise<PlainObject> => {
                loginName = givenLogin
                password = givenPassword
                return logInState.hasOwnProperty('resolve') ?
                    Promise.resolve(logInState.resolve) :
                    Promise.reject(logInState.reject)
            }
            // / endregion
            this.test(`AuthenticationService (${roundType})`, async (
                assert:Object
            ):Promise<void> => {
                const done:Function = assert.async()

                assert.notOk(authentication.error)

                loggedInState = {reject: 'reason'}
                assert.notOk(await authentication.checkLogin())
                assert.strictEqual(authentication.error, 'reason')

                loggedInState = {resolve: 'test'}
                assert.ok(await authentication.checkLogin())

                loggedInState = {resolve: ''}
                assert.notOk(await authentication.checkLogin())

                done()
            })
            this.test(`AuthenticationGuard (${roundType})`, async (
                assert:Object
            ):Promise<void> => {
                const done:Function = assert.async()
                const authenticationGuard:AuthenticationGuard = TestBed.get(
                    AuthenticationGuard)
                const location:Location = TestBed.get(Location)
                AuthenticationGuard.checkEachRouteActiviation = true

                loggedInState = {reject: true}
                location.path('/beforeCheckURL')
                assert.notOk(await authenticationGuard.checkLogin())
                assert.strictEqual(location.path(), '/login')
                assert.strictEqual(
                    authentication.lastRequestedURL, '/beforeCheckURL')

                assert.notOk(await authenticationGuard.checkLogin('/test'))
                assert.strictEqual(authentication.lastRequestedURL, '/test')

                loggedInState = {resolve: 'test'}
                assert.ok(await authenticationGuard.checkLogin())

                loggedInState = {resolve: ''}
                assert.notOk(await authenticationGuard.checkLogin(
                    '/anotherTest'))
                assert.strictEqual(
                    authentication.lastRequestedURL, '/anotherTest')
                assert.notOk(await authenticationGuard.checkLogin())
                assert.strictEqual(
                    authentication.lastRequestedURL, '/anotherTest')

                done()
            })
            // endregion
            // region test components
            this.module(`Module.components (${roundType})`)
            this[
                targetTechnology === 'web' ? 'test' : 'skip'
            ](`LoginComponent (${roundType})`, async (
                assert:Object
            ):Promise<void> => {
                const done:Function = assert.async()
                const fixture:ComponentFixture<LoginComponent> =
                    TestBed.createComponent(LoginComponent)
                const location:Location = TestBed.get(Location)
                fixture.detectChanges()
                await fixture.whenStable()

                assert.strictEqual(fixture.componentInstance.errorMessage, '')
                logInState = {reject: false}
                await fixture.componentInstance.login()
                assert.strictEqual(
                    fixture.componentInstance.errorMessage,
                    'No credentials given.')

                fixture.componentInstance.loginName = 'a'
                fixture.componentInstance.password = 'a'
                authentication.lastRequestedURL = '/login'
                logInState = {reject: false}
                await fixture.componentInstance.login()
                assert.strictEqual(location.path(), '/login')
                assert.strictEqual(loginName, 'a')
                assert.strictEqual(password, 'a')

                fixture.componentInstance.loginName = ''
                fixture.componentInstance.password = ''
                logInState = {reject: false}
                await fixture.componentInstance.login()
                assert.strictEqual(
                    fixture.componentInstance.errorMessage,
                    'No credentials given.')

                assert.strictEqual(loginName, 'a')
                assert.strictEqual(password, 'a')
                fixture.componentInstance.loginName = 'login'
                fixture.componentInstance.password = 'password'
                authentication.lastRequestedURL = '/'
                logInState = {resolve: true}
                await fixture.componentInstance.login()
                assert.strictEqual(fixture.componentInstance.errorMessage, '')
                assert.strictEqual(loginName, 'login')
                assert.strictEqual(password, 'password')

                for (
                    const element:DebugElement of
                    fixture.debugElement.queryAll(By.css('input'))
                ) {
                    element.nativeElement.value = 'test'
                    element.nativeElement.dispatchEvent(getNativeEvent(
                        'input'))
                }
                await fixture.whenStable()
                assert.strictEqual(fixture.componentInstance.loginName, 'test')
                assert.strictEqual(fixture.componentInstance.password, 'test')

                done()
            })
            // endregion
        }
    }
}, '<router-outlet></router-outlet>')
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
