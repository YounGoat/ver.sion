'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

    /* NPM */

    /* in-package */
    , v2 = require('..')

    /* in-file */
    , range_covers = (rangeCode, version, expect) => {
        assert.equal(new v2.Range(rangeCode).covers(version), expect);
    }
    ;

describe('class Range', () => {
    it('range expression validation', () => {
        let tryCode = (code) => {
            let ex;
            try {
                new v2.Range(code);
            } catch (error) {
                ex = error;
            }
            assert(ex);
        };

        // x-range SHOULD NOT be accompanied with comparator.
        tryCode('^1.x.0');

        // version SHOULD be made up of dotted numbers.
        tryCode('a.b.c');

        // invalid decorators.
        tryCode('# 1.1.1');
    });
    
    it('range ^', () => {
        range_covers('^1.0.0', '0.1.0', false);
        range_covers('^1.0.0', '1.0.0', true);
        range_covers('^1.0.0', '1.1.0', true);
        range_covers('^1.0.0', '2.0.0', false);
        
        range_covers('^1.1', '1.0.0', false);
        range_covers('^1.1', '1.1.0', true);
        range_covers('^1.1', '1.2.0', true);
        range_covers('^1.1', '2.0.0', false);

        range_covers('^1', '0.1', false);
        range_covers('^1', '1.0', true);
        range_covers('^1', '1.1', true);
        range_covers('^1', '2.0', false);
    });

    it('range ~', () => {
        range_covers('~1.2.3', '1.1.0', false);
        range_covers('~1.2.3', '1.2.0', false);
        range_covers('~1.2.3', '1.2.3', true);
        range_covers('~1.2.3', '1.2.4', true);
        range_covers('~1.2.3', '1.4.0', false);

        range_covers('~1.2', '1.3.0', false);
        range_covers('~1.2', '1.2.0', true);
        range_covers('~1.2', '1.2.1', true);
        range_covers('~1.2', '1.4.0', false);

        range_covers('~1', '0.0.1', false);
        range_covers('~1', '0.1.0', false);
        range_covers('~1', '1.0.0', true);
        range_covers('~1', '1.2.0', true);
        range_covers('~1', '2.0.0', false);
    });

    it('range x', () => {
        range_covers('1.2.x', '1.2.0', true);
        range_covers('1.2.x', '1.2.1', true);
        range_covers('1.2.x', '1.4.0', false);

        range_covers('1.x.3', '1.0.3', true);
        range_covers('1.x.3', '1.1.3', true);
        range_covers('1.x.3', '2.0.3', false);

        range_covers('1.x', '1.0.0', true);
        range_covers('1.x', '1.1.0', true);
        range_covers('1.x', '2.0.0', false);

        range_covers('x', '1.2.3', true);
    });
    
    it('range >=', () => {    
        range_covers('>=1.2.3', '0.3.4', false);
        range_covers('>=1.2.3', '1.0.4', false);
        range_covers('>=1.2.3', '1.2.2', false);
        range_covers('>=1.2.3', '1.2.3', true);
        range_covers('>=1.2.3', '1.2.4', true);
        range_covers('>=1.2.3', '1.3.0', true);
        range_covers('>=1.2.3', '2.0.0', true);

        range_covers('>=1.2', '0.1.0', false);
        range_covers('>=1.2', '1.1.0', false);
        range_covers('>=1.2', '1.2.0', true);
        range_covers('>=1.2', '1.3.0', true);
        range_covers('>=1.2', '2.0.0', true);

        range_covers('>=1', '0.1.0', false);
        range_covers('>=1', '1.0.0', true);
        range_covers('>=1', '1.0.1', true);
        range_covers('>=1', '1.1.0', true);
        range_covers('>=1', '2.0.0', true);
    });
    
    it('range >', () => {    
        range_covers('>1.2.3', '0.3.4', false);
        range_covers('>1.2.3', '1.0.4', false);
        range_covers('>1.2.3', '1.2.2', false);
        range_covers('>1.2.3', '1.2.3', false);
        range_covers('>1.2.3', '1.2.4', true);
        range_covers('>1.2.3', '1.3.0', true);
        range_covers('>1.2.3', '2.0.0', true);

        range_covers('>1.2', '0.3.0', false);
        range_covers('>1.2', '1.1.0', false);
        range_covers('>1.2', '1.2.0', false);
        range_covers('>1.2', '1.2.1', false);
        range_covers('>1.2', '1.3.0', true);
        range_covers('>1.2', '2.0.0', true);

        range_covers('>2', '0.3.0', false);
        range_covers('>2', '1.0.0', false);
        range_covers('>2', '1.0.1', false);
        range_covers('>2', '1.1.0', false);
        range_covers('>2', '2.0.0', false);
        

    });
    
    it('range <=', () => {    
        range_covers('<=1.2.3', '0.3.4', true);
        range_covers('<=1.2.3', '1.0.4', true);
        range_covers('<=1.2.3', '1.2.2', true);
        range_covers('<=1.2.3', '1.2.3', true);
        range_covers('<=1.2.3', '1.2.4', false);
        range_covers('<=1.2.3', '1.3.0', false);
        range_covers('<=1.2.3', '2.0.0', false);

        range_covers('<=1.2', '0.3.0', true);
        range_covers('<=1.2', '1.1.0', true);
        range_covers('<=1.2', '1.2.0', true);
        range_covers('<=1.2', '1.2.1', true);
        range_covers('<=1.2', '1.3.0', false);
        range_covers('<=1.2', '2.0.0', false);

        range_covers('<=1', '0.1.0', true);
        range_covers('<=1', '1.0.0', true);
        range_covers('<=1', '1.0.1', true);
        range_covers('<=1', '1.1.0', true);
        range_covers('<=1', '2.0.0', false);
    });
        
    it('range <', () => {    
        range_covers('<1.2.3', '0.3.4', true);
        range_covers('<1.2.3', '1.0.4', true);
        range_covers('<1.2.3', '1.2.2', true);
        range_covers('<1.2.3', '1.2.3', false);
        range_covers('<1.2.3', '1.2.4', false);
        range_covers('<1.2.3', '1.3.0', false);
        range_covers('<1.2.3', '2.0.0', false);

        range_covers('<1.2', '0.3.0', true);
        range_covers('<1.2', '1.1.0', true);
        range_covers('<1.2', '1.2.0', false);
        range_covers('<1.2', '1.2.1', false);
        range_covers('<1.2', '1.3.0', false);
        range_covers('<1.2', '2.0.0', false);

        range_covers('<1', '0.1.0', true);
        range_covers('<1', '1.0.0', false);
        range_covers('<1', '2.0.0', false);

    });

    it('range =', () => {    
        range_covers('=1.2.3', '1.2.0', false);
        range_covers('=1.2.3', '1.2.3', true);
        range_covers('=1.2.3', '1.2.4', false);

        range_covers('=1.2', '1.1.0', false);
        range_covers('=1.2', '1.2.0', true);
        range_covers('=1.2', '1.2.3', true);
        range_covers('=1.2', '1.3.0', false);

        range_covers('=1', '0.1.0', false);
        range_covers('=1', '1.0.0', true);
        range_covers('=1', '1.0.2', true);
        range_covers('=1', '1.2.0', true);
        range_covers('=1', '1.2.3', true);
        range_covers('=1', '2.0.0', false);
    });

    it('logical (and)', () => {
        range_covers('>=1 <2', '0.1.0', false);
        range_covers('>=1 <2', '1.0.0', true);
        range_covers('>=1 <2', '2.0.0', false);
    });

    it('logical || (or)', () => {
        range_covers('<1 || >=2', '0.1.0', true);
        range_covers('<1 || >=2', '1.0.0', false);
        range_covers('<1 || >=2', '2.0.0', true);
    });

    it('range -', () => {
        range_covers('1 - 2.3', '0.1.0', false);
        range_covers('1 - 2.3', '1.2.3', true);
        range_covers('1 - 2.3', '2.3.4', true);
        range_covers('1 - 2.3', '2.4.0', false);
    });

    it('spaces compatible', () => {
        range_covers('= 1.2.3', '1.2.3', true);
        range_covers('> 1.2.3', '1.2.4', true);
    });

});