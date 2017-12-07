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

describe('comparator', () => {
    it('lt', () => {
        assert(v2.lt('1.0.0', '1.0.1'));
        assert(v2.lt('1.0.0', '1.1.0'));
        assert(v2.lt('1.0.0', '2.0.0'));
        assert(v2.lt('1.0.0', '2'));
        assert(v2.lt('1', '2.0.0'));
        assert(v2.lt('1', '2'));

        assert(!v2.lt('1.0.1', '1.0.0'));
        assert(!v2.lt('1.1.0', '1.0.0'));
        assert(!v2.lt('2.0.0', '1.0.0'));
        assert(!v2.lt('2', '1.0.0'));
        assert(!v2.lt('2.0.0', '1'));
        assert(!v2.lt('2', '1'));
        
        assert(!v2.lt('1.0.0', '1.0.0'));
        assert(!v2.lt('1.0', '1.0.1'));
        assert(!v2.lt('1', '1.1.0'));
        assert(!v2.lt('1.0.0', '1.0'));
        assert(!v2.lt('1.0.0', '1'));
    });

    it('lte', () => {
        assert(v2.lte('1.0.0', '1.0.1'));
        assert(v2.lte('1.0.0', '1.1.0'));
        assert(v2.lte('1.0.0', '2.0.0'));
        assert(v2.lte('1.0.0', '2'));
        assert(v2.lte('1', '2.0.0'));
        assert(v2.lte('1', '2'));

        assert(!v2.lte('1.0.1', '1.0.0'));
        assert(!v2.lte('1.1.0', '1.0.0'));
        assert(!v2.lte('2.0.0', '1.0.0'));
        assert(!v2.lte('2', '1.0.0'));
        assert(!v2.lte('2.0.0', '1'));
        assert(!v2.lte('2', '1'));
        
        assert(v2.lte('1.0.0', '1.0.0'));
        assert(v2.lte('1.0.0', '1.0'));
        assert(v2.lte('1.0.0', '1.0.1'));
        assert(v2.lte('1.0.0', '1.1.0'));
        assert(v2.lte('1.0.0', '1'));
    });

    it('gt', () => {
        assert(!v2.gt('1.0.0', '1.0.1'));
        assert(!v2.gt('1.0.0', '1.1.0'));
        assert(!v2.gt('1.0.0', '2.0.0'));
        assert(!v2.gt('1.0.0', '2'));
        assert(!v2.gt('1', '2.0.0'));
        assert(!v2.gt('1', '2'));

        assert(v2.gt('1.0.1', '1.0.0'));
        assert(v2.gt('1.1.0', '1.0.0'));
        assert(v2.gt('2.0.0', '1.0.0'));
        assert(v2.gt('2', '1.0.0'));
        assert(v2.gt('2.0.0', '1'));
        assert(v2.gt('2', '1'));
        
        assert(!v2.gt('1.0.0', '1.0.0'));
        assert(!v2.gt('1.0', '1.0.1'));
        assert(!v2.gt('1', '1.1.0'));
        assert(!v2.gt('1.0.1', '1.0'));
        assert(!v2.gt('1.1.0', '1'));
    });

    it('gte', () => {
        assert(!v2.gte('1.0.0', '1.0.1'));
        assert(!v2.gte('1.0.0', '1.1.0'));
        assert(!v2.gte('1.0.0', '2.0.0'));
        assert(!v2.gte('1.0.0', '2'));
        assert(!v2.gte('1', '2.0.0'));
        assert(!v2.gte('1', '2'));

        assert(v2.gte('1.0.1', '1.0.0'));
        assert(v2.gte('1.1.0', '1.0.0'));
        assert(v2.gte('2.0.0', '1.0.0'));
        assert(v2.gte('2', '1.0.0'));
        assert(v2.gte('2.0.0', '1'));
        assert(v2.gte('2', '1'));
        
        assert(v2.gte('1.0.0', '1.0.0'));
        assert(v2.gte('1.0.1', '1.0.0'));
        assert(v2.gte('1.1.0', '1.0.0'));
        assert(v2.gte('1.0.1', '1.0'));
        assert(v2.gte('1.1.0', '1'));
    });

    it('eq', () => {
        assert(!v2.eq('1.0.0', '1.0.1'));
        assert(!v2.eq('1.0.0', '1.1.0'));
        assert(!v2.eq('1.0.0', '2.0.0'));
        assert(!v2.eq('1.0.0', '2'));
        assert(!v2.eq('1', '2.0.0'));
        assert(!v2.eq('1', '2'));

        assert(!v2.eq('1.0.1', '1.0.0'));
        assert(!v2.eq('1.1.0', '1.0.0'));
        assert(!v2.eq('2.0.0', '1.0.0'));
        assert(!v2.eq('2', '1.0.0'));
        assert(!v2.eq('2.0.0', '1'));
        assert(!v2.eq('2', '1'));
        
        assert(v2.eq('1.0.0', '1.0.0'));
        assert(v2.eq('1.0', '1.0.1'));
        assert(v2.eq('1.0.1', '1.0'));
        assert(v2.eq('1.1.0', '1'));
        assert(v2.eq('1.1', '1'));
    });

});