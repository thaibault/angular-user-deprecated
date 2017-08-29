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
// NOTE: Only needed for debugging this file.
try {
    module.require('source-map-support/register')
} catch (error) {}
// endregion
registerAngularTest(function(
    ApplicationComponent:Object, roundType:string, targetTechnology:?string,
    $:any
):{
    bootstrap:Function;
    component:Function;
} {
    // region imports
    const {DataService} = require('angular-generic')
    const {getNativeEvent, RouterOutletStubComponent, RouterStub} = require(
        'angular-generic/mockup')
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
    // endregion
    return {
        bootstrap: ():Array<Object> => {
            // region prepare services
            const initialPath:string = $.global.location.pathname
            $.global.genericInitialData = {configuration: {
                database: {
                    connector: {adapter: 'memory'},
                    plugins: [PouchDBAdapterMemory]
                }
            }}
            const Module:Object = index.default
            const {AuthenticationGuard, AuthenticationService} = index
            const self:Object = this
            // IgnoreTypeCheck
            @NgModule({
                bootstrap: [ApplicationComponent],
                declarations: [ApplicationComponent],
                imports: [
                    Module,
                    NoopAnimationsModule,
                    RouterModule.forRoot([{
                        component: ApplicationComponent, path: '**'
                    }])
                ]
            })
            // endregion
            // region test services
            /**
             * Represents a mockup module to test bootstrapping.
             */
            class TestModule {
                /**
                 * Includes all unit tests since we can inject all testing
                 * subjects here.
                 * @param authentication - Authentication service instance to
                 * test.
                 * @param authenticationGuard - Authentication guard service
                 * instance to test.
                 * @param data - Data service instance to test.
                 * @param location - Location service instance to test.
                 */
                constructor(
                    authentication:AuthenticationService,
                    authenticationGuard:AuthenticationGuard, data:DataService,
                    location:Location
                ):void {
                    self.test(`AuthenticationService (${roundType})`, async (
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
                    self.test(`AuthenticationGuard (${roundType})`, async (
                        assert:Object
                    ):Promise<void> => {
                        const done:Function = assert.async()
                        data.remoteConnection = {}
                        assert.strictEqual(location.path(), initialPath)
                        data.remoteConnection.getSession = async (
                        ):Promise<PlainObject> => new Promise((
                            resolve:Function, reject:Function
                        ):void => reject(true))
                        assert.notOk(await authenticationGuard.checkLogin())
                        assert.strictEqual(location.path(), '/login')
                        console.log(authenticationGuard)
                        assert.strictEqual(
                            authentication.lastRequestedURL, null)
                        assert.notOk(await authenticationGuard.checkLogin(
                            '/test'))
                        assert.strictEqual(
                            authentication.lastRequestedURL, '/test')
                        data.remoteConnection.getSession = async (
                        ):Promise<PlainObject> => new Promise((
                            resolve:Function
                        ):void => resolve({userCtx: {name: 'test'}}))
                        try {
                            assert.ok(await authenticationGuard.checkLogin())
                            data.remoteConnection.getSession = (
                            ):PlainObject => {
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
                        if (
                            $.global.history && 'pushState' in $.global.history
                        )
                            $.global.history.pushState({}, '', initialPath)
                        done()
                    })
                }
            }
            this.module(`Module.services (${roundType})`)
            return [TestModule, {
                declarations: [RouterOutletStubComponent],
                imports: [Module, NoopAnimationsModule],
                providers: [{provide: Router, useClass: RouterStub}]
            }]
            // endregion
        },
        component: function(TestBed:Object, roundType:string):void {
            // region prepare components
            const {LoginComponent} = index
            // endregion
            // region test components
            this.module(`Module.components (${roundType})`)
            this.test(`LoginComponent (${roundType})`, async (
                assert:Object
            ):Promise<void> => {
                const done:Function = assert.async()
                const fixture:ComponentFixture<LoginComponent> =
                    TestBed.createComponent(LoginComponent)
                fixture.detectChanges()
                await fixture.whenStable()
                assert.strictEqual(fixture.componentInstance.errorMessage, '')
                await fixture.componentInstance.login()
                assert.ok(fixture.componentInstance.errorMessage)
                const {remoteConnection} = TestBed.get(DataService)
                const loginBackup:Function = remoteConnection.login
                let loginName:string
                let password:string
                remoteConnection.login = (
                    givenLogin:string, givenPassword:string
                ):Promise<void> => {
                    loginName = givenLogin
                    password = givenPassword
                    return Promise.resolve()
                }
                assert.strictEqual(TestBed.get(Router).url, '/login')
                try {
                    fixture.componentInstance.loginName = null
                    fixture.componentInstance.password = null
                    await fixture.componentInstance.login()
                    assert.strictEqual(
                        fixture.componentInstance.errorMessage, '')
                    assert.strictEqual(TestBed.get(Router).url, '/')
                    assert.notOk(loginName)
                    assert.notOk(password)
                    fixture.componentInstance.loginName = 'login'
                    fixture.componentInstance.password = 'password'
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
                    console.error(error)
                    throw error
                } finally {
                    remoteConnection.login = loginBackup
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
