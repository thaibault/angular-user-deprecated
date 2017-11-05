<!-- #!/usr/bin/env markdown
-*- coding: utf-8 -*- -->

<!-- region header

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

endregion -->

[![Build Status](https://travis-ci.org/thaibault/angularUser.svg?branch=master)](https://travis-ci.org/thaibault/angularUser)

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
