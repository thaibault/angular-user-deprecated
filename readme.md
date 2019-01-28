<!-- #!/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm version](https://badge.fury.io/js/angular-user.svg)](https://www.npmjs.com/package/angular-user)
[![downloads](https://img.shields.io/npm/dy/angular-user.svg)](https://www.npmjs.com/package/angular-user)
[![build status](https://travis-ci.org/thaibault/angularUser.svg?branch=master)](https://travis-ci.org/thaibault/angularUser)
[![code coverage](https://coveralls.io/repos/github/thaibault/angularUser/badge.svg)](https://coveralls.io/github/thaibault/angularUser)
[![dependencies](https://img.shields.io/david/thaibault/angular-user.svg)](https://david-dm.org/thaibault/angular-user)
[![development dependencies](https://img.shields.io/david/dev/thaibault/angular-user.svg)](https://david-dm.org/thaibault/angular-user?type=dev)
[![peer dependencies](https://img.shields.io/david/peer/thaibault/angular-user.svg)](https://david-dm.org/thaibault/angular-user?type=peer)
[![documentation website](https://img.shields.io/website-up-down-green-red/https/torben.website/angularUser.svg?label=documentation-website)](https://torben.website/angularUser)

Use case
--------

This modules is ahead of time compatible and ready for tree-shaking, can be
used as umd module for just in time compilation and supports the babel-stack
as esnext with flow.js annotations or typescript within the same codebase!

This module provides generic user session, authorisation and authentication
mechanisms including needed guards to intercept between resource requests which
needs authorisation.

- Authorisation service
- Authentication service (during routing)
- LogIn-Component with key binding and validation

<!-- region vim modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
