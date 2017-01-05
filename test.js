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
import registerTest from 'clientnode/test'
import PouchDBAdabterMemory from 'pouchdb-adapter-memory'
// NOTE: Only needed for debugging this file.
try {
    module.require('source-map-support/register')
} catch (error) {}
// endregion
// region declaration
declare var DEBUG:boolean
declare var TARGET_TECHNOLOGY:string
// endregion
registerTest(async function(
    roundType:string, targetTechnology:?string, $:any
):Promise<void> {
    // region mocking angular environment
    $('head').append('<base href="/">')
    const self:Object = this
    $.global.genericInitialData = {configuration: {
        database: {
            url: 'test',
            options: {adapter: 'memory'},
            plugins: [PouchDBAdabterMemory]
        },
        test: true
    }}
    /*
        NOTE: A working polymorphic angular environment needs some assumptions
        about the global scope, so mocking and initializing that environment
        after a working browser environment is present.
    */
    if (TARGET_TECHNOLOGY === 'node') {
        global.window = $.global
        global.document = $.context
        global.Element = $.global.Element
        global.window.Reflect = global.Reflect
        process.setMaxListeners(30)
    }
    require('hammerjs')
    const {Component, enableProdMode, NgModule} = require('@angular/core')
    const {TestBed} = require('@angular/core/testing')
    const {By} = require('@angular/platform-browser')
    const {platformBrowserDynamic} = require(
        '@angular/platform-browser-dynamic')
    const {BrowserDynamicTestingModule, platformBrowserDynamicTesting} =
        require('@angular/platform-browser-dynamic/testing')
    const {Router, RouterModule} = require('@angular/router')
    const {RouterTestingModule} = require('@angular/router/testing')
    const index:Object = require('./index')
    const UserModule:Object = index.default
    const {
        RouterLinkStubDirective, RouterOutletStubComponent, RouterStub,
        ActivatedRouteStub
    } = require('angular-generic/mockup')
    const {
        AuthenticationGuard,
        LoginComponent
    } = index
    @Component({
        selector: '#qunit-fixture',
        template: '<div>Application<router-outlet></router-outlet></div>'
    })
    class ApplicationComponent {}
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
    class Module {
        constructor(authentication:AuthenticationGuard):void {
            self.test(`AuthenticationGuard (${roundType})`, (
                assert:Object
            ):void => {
                assert.strictEqual('TODO', 'TODO')
            })
        }
    }
    if (!DEBUG)
        enableProdMode()
    this.module(`UserModule.services (${roundType})`)
    let platform:Object
    let module:Object
    try {
        platform = platformBrowserDynamic()
        module = await platform.bootstrapModule(Module)
    } catch (error) {
        throw error
    }
    this.load()
    await new Promise((resolve:Function):void => {
        let done:boolean = false
        this.moduleDone(():void => {
            if (done)
                return
            done = true
            module.destroy()
            platform.destroy()
            resolve()
        })
    })
    // endregion
    // region test components
    this.module(`UserModule.components (${roundType})`)
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting()
    ).configureTestingModule({
        declarations: [
            ApplicationComponent,
            RouterLinkStubDirective,
            RouterOutletStubComponent
        ],
        imports: [UserModule],
        providers: [{provide: Router, useClass: RouterStub}]
    })
    await TestBed.compileComponents()
    this.test(`LoginComponent (${roundType})`, async (
        assert:Object
    ):Promise<void> => {
        const {componentInstance} = TestBed.createComponent(
            LoginComponent)
        componentInstance.model = {disabled: true}
        assert.ok(componentInstance._authentication)
    })
    // endregion
}, ['full'])
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
