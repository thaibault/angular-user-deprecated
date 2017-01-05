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
import registerAngularTest from 'angular-generic/test'
import PouchDBAdabterMemory from 'pouchdb-adapter-memory'
// NOTE: Only needed for debugging this file.
try {
    module.require('source-map-support/register')
} catch (error) {}
// endregion
registerAngularTest({bootstrap: function(
    ApplicationComponent:Object, roundType:string,
    targetTechnology:?string, $:any
):Array<Object> {
    // region prepare services
    $.global.genericInitialData = {configuration: {database: {
        url: 'test',
        options: {adapter: 'memory'},
        plugins: [PouchDBAdabterMemory]
    }}}
    const {
        RouterLinkStubDirective, RouterOutletStubComponent, RouterStub
    } = require('angular-generic/mockup')
    const {NgModule} = require('@angular/core')
    const {Router, RouterModule} = require('@angular/router')
    const index:Object = require('./index')
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
    class Module {
        constructor(authentication:AuthenticationGuard):void {
            self.test(`AuthenticationGuard (${roundType})`, (
                assert:Object
            ):void => {
                assert.strictEqual('TODO', 'TODO')
            })
        }
    }
    this.module(`UserModule.services (${roundType})`)
    return [Module, {
        declarations: [
            ApplicationComponent,
            RouterLinkStubDirective,
            RouterOutletStubComponent
        ],
        imports: [UserModule],
        providers: [{provide: Router, useClass: RouterStub}]
    }]
    // endregion
}, component: function(TestBed:Object, roundType:string):void {
    // region prepare components
    const {LoginComponent} = require('./index')
    // endregion
    // region test components
    this.module(`UserModule.components (${roundType})`)
    this.test(`LoginComponent (${roundType})`, (assert:Object):void => {
        const {componentInstance} = TestBed.createComponent(
            LoginComponent)
        componentInstance.model = {disabled: true}
        assert.ok(componentInstance._authentication)
    })
    // endregion
}}, '<router-outlet></router-outlet>')
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
