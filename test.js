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
import PouchDBAdabterMemory from 'pouchdb-adapter-memory'
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
    const {GenericDataService} = require('angular-generic')
    const {getNativeEvent, RouterOutletStubComponent, RouterStub} = require(
        'angular-generic/mockup')
    const {DebugElement, NgModule} = require('@angular/core')
    const {ComponentFixture} = require('@angular/core/testing')
    const {By} = require('@angular/platform-browser')
    const {Router, RouterModule} = require('@angular/router')
    const index:Object = require('./index')
    // endregion
    return {
        bootstrap: ():Array<Object> => {
            // region prepare services
            const initialPath:string = $.global.location.pathname
            $.global.genericInitialData = {configuration: {database: {
                url: 'test',
                options: {adapter: 'memory'},
                plugins: [PouchDBAdabterMemory]
            }}}
            const UserModule:Object = index.default
            const {AuthenticationGuard} = index
            const self:Object = this
            // IgnoreTypeCheck
            @NgModule({
                bootstrap: [ApplicationComponent],
                declarations: [ApplicationComponent],
                imports: [
                    RouterModule.forRoot([{
                        component: ApplicationComponent, path: '**'
                    }]),
                    UserModule
                ]
            })
            // endregion
            // region test services
            /**
             * Represents a mockup module to test bootstrapping.
             */
            class Module {
                /**
                 * Includes all unit tests since we can inject all testing
                 * subjects here.
                 * @param authentication - Authentication service instance to
                 * test.
                 * @param data - Data service instance to test.
                 * @param router - Router service instance to test.
                 */
                constructor(
                    authentication:AuthenticationGuard,
                    data:GenericDataService, router:Router
                ):void {
                    self.test(`AuthenticationGuard (${roundType})`, async (
                        assert:Object
                    ):Promise<void> => {
                        assert.notOk(authentication.error)
                        assert.strictEqual(router.url, initialPath)
                        assert.notOk(await authentication.checkLogin())
                        assert.ok(authentication.error)
                        assert.strictEqual(router.url, '/login')
                        assert.strictEqual(
                            authentication.lastRequestedURL, null)
                        assert.notOk(await authentication.checkLogin('/test'))
                        assert.strictEqual(
                            authentication.lastRequestedURL, '/test')
                        const sessionBackup:Function =
                            data.connection.getSession
                        data.connection.getSession = ():PlainObject => {
                            return {userCtx: {name: 'test'}}
                        }
                        try {
                            assert.ok(await authentication.checkLogin())
                            data.connection.getSession = ():PlainObject => {
                                return {userCtx: {name: ''}}
                            }
                            assert.notOk(await authentication.checkLogin(
                                '/anotherTest'))
                        } catch (error) {
                            throw error
                        } finally {
                            data.connection.getSession = sessionBackup
                        }
                        assert.strictEqual(
                            authentication.lastRequestedURL, '/anotherTest')
                        if (
                            $.global.history && 'pushState' in $.global.history
                        )
                            $.global.history.pushState({}, '', initialPath)
                    })
                }
            }
            this.module(`UserModule.services (${roundType})`)
            return [Module, {
                declarations: [RouterOutletStubComponent],
                imports: [UserModule],
                providers: [{provide: Router, useClass: RouterStub}]
            }]
            // endregion
        },
        component: function(TestBed:Object, roundType:string):void {
            // region prepare components
            const {LoginComponent} = index
            // endregion
            // region test components
            this.module(`UserModule.components (${roundType})`)
            this.test(`LoginComponent (${roundType})`, async (
                assert:Object
            ):Promise<void> => {
                const done:Function = assert.async()
                const fixture:ComponentFixture<LoginComponent> =
                    TestBed.createComponent(LoginComponent)
                fixture.detectChanges()
                await fixture.whenStable()
                assert.strictEqual(fixture.componentInstance.errorMessage, '')
                await fixture.componentInstance.performLogin()
                assert.ok(fixture.componentInstance.errorMessage)
                const {connection} = TestBed.get(GenericDataService)
                const loginBackup:Function = connection.login
                let login:string
                let password:string
                connection.login = (
                    givenLogin:string, givenPassword:string
                ):Promise<void> => {
                    login = givenLogin
                    password = givenPassword
                    return Promise.resolve()
                }
                assert.strictEqual(TestBed.get(Router).url, '/login')
                try {
                    await fixture.componentInstance.performLogin()
                    assert.strictEqual(
                        fixture.componentInstance.errorMessage, '')
                    assert.strictEqual(TestBed.get(Router).url, '/')
                    assert.notOk(login)
                    assert.notOk(password)
                    fixture.componentInstance.login = 'login'
                    fixture.componentInstance.password = 'password'
                    await fixture.componentInstance.performLogin()
                    assert.strictEqual(
                        fixture.componentInstance.errorMessage, '')
                    assert.strictEqual(TestBed.get(Router).url, '/')
                    assert.strictEqual(login, 'login')
                    assert.strictEqual(password, 'password')
                    for (
                        const element:DebugElement of
                        fixture.debugElement.queryAll(By.css('input'))
                    ) {
                        element.nativeElement.value = 'test'
                        element.nativeElement.dispatchEvent(getNativeEvent(
                            'input'))
                    }
                    fixture.detectChanges()
                    await fixture.whenStable()
                    assert.strictEqual(fixture.componentInstance.login, 'test')
                    assert.strictEqual(
                        fixture.componentInstance.password, 'test')
                } catch (error) {
                    throw error
                } finally {
                    connection.login = loginBackup
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
