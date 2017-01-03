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
    const hammerjs:Object = require('hammerjs')
    const {DebugElement, Component, enableProdMode, NgModule} = require(
        '@angular/core')
    const {ComponentFixture, TestBed} = require('@angular/core/testing')
    const By:Object = require('@angular/platform-browser').By
    const platformBrowserDynamic:Function = require(
        '@angular/platform-browser-dynamic'
    ).platformBrowserDynamic
    const {BrowserDynamicTestingModule, platformBrowserDynamicTesting} =
        require('@angular/platform-browser-dynamic/testing')
    const RouterModule:Object = require('@angular/router').RouterModule
    const index:Object = require('./index')
    const UserModule:Object = index.default
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
    // NOTE: Simply doing "await new Promise(..." doesn't work yet.
    const serviceTests:Promise<void> = new Promise((resolve:Function):void => {
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
    serviceTests.then(():void => {
        this.module(`UserModule.components (${roundType})`)
        TestBed.initTestEnvironment(
            BrowserDynamicTestingModule, platformBrowserDynamicTesting()
        ).configureTestingModule({imports: [Module]})
        this.test(`LoginComponent (${roundType})`, async (
            assert:Object
        ):void => {
            const done:Function = assert.async()
            await TestBed.compileComponents(LoginComponent)
            const fixture = TestBed.createComponent(LoginComponent)
            fixture.componentInstance.model = {disabled: true}
            fixture.componentInstance.ngOnInit()
            assert.strictEqual(fixture.componentInstance.errorMessage, '')
            done()
        })
    })
    // endregion
}, ['full'])
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
