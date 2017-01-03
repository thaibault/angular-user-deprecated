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
registerTest(function(roundType:string, targetTechnology:?string, $:any):void {
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
    const core:Object = require('@angular/core')
    const {Component, enableProdMode, NgModule} = core
    const platformBrowserDynamic:Function = require(
        '@angular/platform-browser-dynamic'
    ).platformBrowserDynamic
    const RouterModule:Object = require('@angular/router').RouterModule
    const index:Object = require('./index')
    const UserModule = index.default
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
    class ApplicationModule {
        constructor(authentication:AuthenticationGuard):void {
            // region tests
            self.test('AuthenticationGuard', (assert:Object):void => {
                assert.strictEqual('TODO', 'TODO')
            })
            self.test('LoginComponent', (assert:Object):void => {
                assert.strictEqual('TODO', 'TODO')
            })
            // endregion
        }
    }
    if (!DEBUG)
        enableProdMode()
    this.test('UserModule', (assert:Object):void => assert.ok(
        platformBrowserDynamic().bootstrapModule(ApplicationModule)))
}, ['full'])
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
