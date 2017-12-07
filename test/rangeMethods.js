'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

    /* NPM */
    , noda = require('noda')

    /* in-package */
    , v2 = require('..')

    /* in-file */
    , range_covers = (rangeCode, version, expect) => {
        assert.equal(new semver.Range(rangeCode).covers(version), expect);
    }
    ;

describe('range methods', () => {
    it('covers', () => {
        v2.covers('>1', '2');
    });

    it('satisfy', () => {
        v2.satisfy('1', '<2');
    });
});