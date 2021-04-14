#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    , commandos = require('commandos')
    , noda = require('noda')
    
    /* in-package */
    , ver = require('..')
    ;

const argv = process.argv.slice(2);

if (argv.length != 3) {
    commandos.man(noda.inRead('help.txt', 'utf8'));
    return;
}

const [ left, operator, right ] = argv;
let fnName = null;
if (typeof ver[operator] == 'function') {
    fnName = operator;
}

if (!fnName) {
    let matchedNames = [];
    for (let key in ver) {
        if (key.startsWith(operator)) {
            matchedNames.push(key);
        }
    }
    if (matchedNames.length == 1) {
        fnName = matchedNames[0];
    }
    else if (matchedNames.length > 1) {
        console.warn('Ambiguous operator found:', matchedNames.join(', '));
        process.exit(1);
    }
}

if (!fnName) {
    console.log('Invalid operator:', operator);
    process.exit(1);
}

let ret;
try {
    ret = ver[fnName](left, right);    
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

console.log('version calculator:');
console.log(ret ? '[\u2714]' : '[\u2715]', left, fnName, right);
