/**
 * @author youngoat@163.com
 * 
 * -- REFERENCES --
 * https://github.com/npm/node-semver#range-grammar
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */

    /* in-file */
    , papply = function(fn /* , predefined_argument, ... */) {
        let predetermined = Array.from(arguments).slice(1);
        return function() {
            let remainders = Array.from(arguments);
            let args = predetermined.concat(remainders);
            return fn.apply(this, args);
        };
    }

    , nextVersion = (partial) => {
        let parts = partial.replace(/[xX]/, '*').split('.');
        let index = parts.indexOf('*');
        if (index == 0) {
            return null;
        }
        else {
            let pos = (index == -1) ? parts.length - 1 : index - 1;
            let nextPart = parseInt(parts[pos]) + 1;
            let nextParts = parts.slice(0, pos).concat(nextPart);
            return nextParts.join('.');
        }
    }

    , compareParts = (compare, ifEqual, partsA, partsB) => {
        let l = Math.min(partsA.length, partsB.length);
        for (let i = 0; i < l; i++) {
            if (partsA[i] != partsB[i]) return compare(partsA[i], partsB[i]);
        }
        return ifEqual;
    }

    , validateVersion = (ver) => {
        ver = ver.trim().replace(/^v/i, '');
        if (!/^\d+(\.\d+)*/.test(ver)) {
            ver = null;
        }
        return ver;
    }
    
    , compareVersions = (compare, ifEqual, va, vb) => {
        let vva = validateVersion(va);
        let vvb = validateVersion(vb);

        if (!vva) throw new Error(`invalid version notation: ${va}`);
        if (!vvb) throw new Error(`invalid version notation: ${vb}`);

        return compareParts(compare, ifEqual, vva.split('.'), vvb.split('.'));
    }

    , coverFn = {
        '~': (rangeParts, versionParts) => {
            // https://www.npmjs.com/package/semver#range-grammar
            // Allows patch-level changes if a minor version is specified on the comparator. 
            // Allows minor-level changes if not.

            if (coverFn['<'](rangeParts, versionParts)) {
                return false;
            }
            
            if (rangeParts.length == 1) {
                return rangeParts[0] == versionParts[0];
            }
            else {
                return rangeParts[0] == versionParts[0] && rangeParts[1] == versionParts[1];
            }
        },

        '^': (rangeParts, versionParts) => {
            if (coverFn['<'](rangeParts, versionParts)) {
                return false;
            }

            for (let i = 0; i < rangeParts.length; i++) {
                // Ingore the leading zero version rangeParts.
                if (rangeParts[i] == 0 && versionParts[i] == 0) continue;
                
                // The first non-zero parts SHOULD equal.
                return rangeParts[i] == versionParts[i];
            }
            
            // Special case:
            // ^0.0.0 covers 0.0.0
            return true;
        },

        '=' : (rangeParts, versionParts) => {
            let covered = true;
            for (let i = 0; covered && i < rangeParts.length; i++) {
                if (rangeParts[i] == 'x') continue;

                if (versionParts.length <= i) {
                    covered = false;
                }
                else {
                    covered = (versionParts[i] == rangeParts[i]);
                }
            }
            return covered;
        },
        
        '>=': papply(compareParts, (a, b) => b > a, true ),
        '>' : papply(compareParts, (a, b) => b > a, false),
        '<=': papply(compareParts, (a, b) => b < a, true ),
        '<' : papply(compareParts, (a, b) => b < a, false),
    }
    ;

function Range(rangeCode) {
    let orRanges = null, andRanges = null, comparator = null, parts = null;
    let parsed = false;

    rangeCode = rangeCode.trim();
    
    if (!parsed) {
        let orRangeCodes = rangeCode.split('||');
        if (orRangeCodes.length > 1) {
            // 递归调用。
            orRanges = orRangeCodes.map((code) => {
                return new Range(code)
            });
            parsed = true;
        }
    }

    if (!parsed) {
        // Remove needless spaces.
        rangeCode = rangeCode.replace(/\s+-\s+/g, 'TO');
        rangeCode = rangeCode.replace(/([<>=~^]+)\s+/g, '$1');
        
        let andRangeCodes = rangeCode.split(/\s+/);
        if (andRangeCodes.length > 1) {
            andRanges = andRangeCodes.map(code => new Range(code));
            parsed = true;
        }
    }

    if (!parsed) {
        let hyphenRangeCodes = rangeCode.split('TO');
        if (hyphenRangeCodes.length > 1) {
            let startCode = `>=${hyphenRangeCodes[0]}`;
            let endCode = nextVersion(hyphenRangeCodes[1]);
            if (endCode) {
                andRanges = [ new Range(startCode), new Range(`<${endCode}`) ];
            }
            parsed = true;
        }
    }

    if (!parsed) {
        comparator = '=';
        parts = [];

        let versionCode = rangeCode;
        [ '>=', '<=', '>', '<', '=', '^', '~' ].every((sign) => {
            if (rangeCode.startsWith(sign)) {
                comparator = sign;
                versionCode = rangeCode.substr(comparator.length);
                return false;
            }
            return true;
        });

        parts = versionCode.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (['x', 'X', '*'].includes(parts[i])) {
                if (comparator != '=') {
                    throw new Error(`comparator is unreadable in x-range: ${rangeCode}`);
                }
            }
            else if (/^\d+$/.test(parts[i])) {
                parts[i] = parseInt(parts[i]);
            }
            else {
                throw new Error(`invalid semantic version: ${versionCode}`);
            }
        }
    }

    this._ = { orRanges, andRanges, rangeCode, comparator, parts }; 
}

Range.prototype.covers = function(version) {

    if (this._.orRanges) {
        let covered = false;
        this._.orRanges.every((range) => !(covered = range.covers(version)));
        return covered;
    }

    if (this._.andRanges) {
        let covered = true;
        this._.andRanges.every((range) => covered = range.covers(version));
        return covered;
    }

    let versionParts = version.split('.');
    if (versionParts.length < this._.parts.length) {
        throw new Error(`uncomparable version range and version: ${this._.rangeCode} vs. ${version}`);
    }
    return coverFn[this._.comparator](this._.parts, versionParts);
};

function lt(a, b) {
    let fn = (a, b) => a < b;
    return compareVersions(fn, false, a, b);
}

function gt(a, b) {
    let fn = (a, b) => a > b;
    return compareVersions(fn, false, a, b);
}

function lte(a, b) {
    let fn = (a, b) => a < b;
    return compareVersions(fn, true, a, b);
}

function gte(a, b) {
    let fn = (a, b) => a > b;
    return compareVersions(fn, true, a, b);
}

function eq(a, b) {
    let fn = () => false;
    return compareVersions(fn, true, a, b);
}

function neq(a, b) {
    return !eq(a, b);
}

function covers(rangeCode, version) {
    return new Range(rangeCode).covers(version);
}

function satisfy(version, rangeCode) {
    return covers(rangeCode, version);
}

module.exports = {
    Range,

    lt,
    lte,
    gt,
    gte,
    eq,
    neq,

    lessThan: lt,
    lessThanEqual: lte,
    greaterThan: gt,
    greaterThanEqual: gte,
    equal: eq,
    notEqual: neq,

    covers,
    satisfy,

};