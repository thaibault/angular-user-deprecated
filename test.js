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
    See http://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import type {PlainObject} from 'clientnode'
import registerAngularTest from 'angular-generic/testRunner'
import PouchDBAdapterMemory from 'pouchdb-adapter-memory'
// endregion
registerAngularTest(function(
    ApplicationComponent:Object, roundType:string, targetTechnology:?string,
    $:any
):{bootstrap:Function;test:Function} {
    // region imports
    const {DataService, UtilityService} = require('angular-generic')
    const {
        getNativeEvent, LocationStub, RouterOutletStubComponent, RouterStub
    } = require('angular-generic/mockup')
    const {Location} = require('@angular/common')
    /* eslint-disable no-unused-vars */
    const {DebugElement, NgModule} = require('@angular/core')
    /* eslint-enable no-unused-vars */
    const {ComponentFixture} = require('@angular/core/testing')
    const {By} = require('@angular/platform-browser')
    const {NoopAnimationsModule} = require(
        '@angular/platform-browser/animations')
    const {Router, RouterModule} = require('@angular/router')
    const index:Object = require('./index')
    const Module:Object = index.default
    const {AuthenticationGuard, AuthenticationService, LoginComponent} = index
    // endregion
    // region prepare services
    $.global.genericInitialData = {configuration: {database: {
        connector: {adapter: 'memory'},
        plugins: [PouchDBAdapterMemory]
    }}}
    // endregion
    return {
        bootstrap: ():Array<Object> => ({
            declarations: [RouterOutletStubComponent],
            imports: [Module, NoopAnimationsModule],
            providers: [
                {provide: Location, useClass: LocationStub},
                {provide: Router, useClass: RouterStub}
            ]
        }),
        test: function(TestBed:Object, roundType:string):void {
            // region test services
            this.module(`Module.services (${roundType})`)
            const authentication:AuthenticationService = TestBed.get(
                AuthenticationService)
            const data:DataService = TestBed.get(DataService)
            this.test(`AuthenticationService (${roundType})`, async (
                assert:Object
            ):Promise<void> => {
                const done:Function = assert.async()
                data.remoteConnection = {}
                assert.notOk(authentication.error)
                data.remoteConnection.getSession = async (
                ):Promise<PlainObject> => new Promise((
                    resolve:Function, reject:Function
                ):void => reject(true))
                assert.notOk(await authentication.checkLogin())
                assert.ok(authentication.error)
                data.remoteConnection.getSession = async (
                ):Promise<PlainObject> => new Promise((
                    resolve:Function
                ):void => resolve({userCtx: {name: 'test'}}))
                try {
                    assert.ok(await authentication.checkLogin())
                    data.remoteConnection.getSession = (
                    ):PlainObject => {
                        return {userCtx: {name: ''}}
                    }
                    assert.notOk(await authentication.checkLogin(
                        '/anotherTest'))
                } catch (error) {
                    throw error
                } finally {
                    data.remoteConnection = null
                }
                assert.ok(await authentication.checkLogin())
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
                data.remoteConnection = {
                    getSession: async ():Promise<PlainObject> =>
                        new Promise((
                            resolve:Function, reject:Function
                        ):void => reject(true))
                }
                assert.notOk(await authenticationGuard.checkLogin())
                assert.strictEqual(location.path(), '/login')
                assert.strictEqual(authentication.lastRequestedURL, '/')
                assert.notOk(await authenticationGuard.checkLogin('/test'))
                assert.strictEqual(
                    authentication.lastRequestedURL, '/test')
                data.remoteConnection.getSession = async (
                ):Promise<PlainObject> => new Promise((
                    resolve:Function
                ):void => resolve({userCtx: {name: 'test'}}))
                try {
                    assert.ok(await authenticationGuard.checkLogin())
                    data.remoteConnection.getSession = ():PlainObject => {
                        return {userCtx: {name: ''}}
                    }
                    assert.notOk(await authenticationGuard.checkLogin(
                        '/anotherTest'))
                } catch (error) {
                    throw error
                } finally {
                    data.remoteConnection = null
                }
                assert.strictEqual(
                    authentication.lastRequestedURL, '/anotherTest')
                assert.ok(await authenticationGuard.checkLogin())
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
                try {
                    const fixture:ComponentFixture<LoginComponent> =
                        TestBed.createComponent(LoginComponent)
                    fixture.detectChanges()
                    await fixture.whenStable()
                    assert.strictEqual(
                        fixture.componentInstance.errorMessage, '')
                    // NOTE: Wait for initializing database connection.
                    await TestBed.get(UtilityService).fixed.tools.timeout()
                    await fixture.componentInstance.login()
                    assert.strictEqual(
                        fixture.componentInstance.errorMessage,
                        'No credentials given.')
                    const {remoteConnection} = TestBed.get(DataService)
                    const loginBackup:Function = remoteConnection.login
                    try {
                        let loginName:string
                        let password:string
                        remoteConnection.login = (
                            givenLogin:string, givenPassword:string
                        ):Promise<void> => {
                            loginName = givenLogin
                            password = givenPassword
                            return Promise.resolve()
                        }
                        fixture.componentInstance.loginName = 'a'
                        fixture.componentInstance.password = 'a'
                        TestBed.get(AuthenticationService).lastRequestedURL =
                            '/login'
                        await fixture.componentInstance.login()
                        assert.strictEqual(TestBed.get(Router).url, '/login')
                        assert.strictEqual(loginName, 'a')
                        assert.strictEqual(password, 'a')
                        fixture.componentInstance.loginName = null
                        fixture.componentInstance.password = null
                        await fixture.componentInstance.login()
                        assert.strictEqual(
                            fixture.componentInstance.errorMessage,
                            'No credentials given.')
                        assert.strictEqual(loginName, 'a')
                        assert.strictEqual(password, 'a')
                        fixture.componentInstance.loginName = 'login'
                        fixture.componentInstance.password = 'password'
                        TestBed.get(AuthenticationService).lastRequestedURL =
                            '/'
                        await fixture.componentInstance.login()
                        assert.strictEqual(
                            fixture.componentInstance.errorMessage, '')
                        assert.strictEqual(TestBed.get(Router).url, '/')
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
                        assert.strictEqual(
                            fixture.componentInstance.loginName, 'test')
                        assert.strictEqual(
                            fixture.componentInstance.password, 'test')
                    } catch (error) {
                        throw error
                    } finally {
                        remoteConnection.login = loginBackup
                    }
                } catch (error) {
                    console.error(error)
                    throw error
                }
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
