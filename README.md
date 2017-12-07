#	ver.sion
__light-weighted semantic version implementation and enhancement__

##	Table of contents

*	[Get Started](#get-started)
*	[API](#api)
* 	[Examples](#examples)
*	[Why ver.sion](#why-ver.sion)
*	[Honorable Dependents](#honorable-dependents)
*	[References](#references)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/ver.sion)

##	Get Started

```javascript
const ver = require('ver.sion');

// Compare two versions.
ver.lt('1.2.3', '1.3.0');  // true
ver.gt('1.2.3', '1.2.0');  // true
ver.eq('1.2.3', '1.2'  );  // true

const range = new ver.Range('^1.2.3');
range.covers('1.2.0');    // false
range.covers('1.2.3');    // true
range.covers('1.3.0');    // true
range.covers('2.0.0');    // false
```

##	API

Suppose `ver` is the name of required package:

```javascript
const ver = require('ver.sion');
// OR require package named "V2" if you prefer and have installed with such name.
const ver = require('V2');
```

__ver.sion__ accepts dot-number notation according to [Semantic Versioning 2.0.0](https://semver.org) (hereinafter referred as *SemVer*). However, versions having less or more than three numbers, which are understood as *Major*, *Minor* and *Patch*, are also accepted. For *SemVer*, `1.2.3` is valid, but `1.2.3.4` and `1.2` are invalid (`1.2` is accepted as version range in NPM package [semver](https://www.npmjs.com/package/semver)). For __ver.sion__, all of them are valid versions.

### Class ver.Range

```javascript
const range = new ver.Range(version_range_code);
```

The syntax of `version_range_code` is compatible with which used in [semver](https://www.npmjs.com/package/semver).

### Comparators Methods

__ver.sion__ has following static methods to compare two versions:
*   boolean __eq__(string *v1*, string *v2*)
*   boolean __neq__(string *v1*, string *v2*)
*   boolean __lt__(string *v1*, string *v2*)
*   boolean __gt__(string *v1*, string *v2*)
*   boolean __lte__(string *v1*, string *v2*)
*   boolean __gte__(string *v1*, string *v2*)
*   boolean __equal__(string *v1*, string *v2*)
*   boolean __notEqual__(string *v1*, string *v2*)
*   boolean __lessThan__(string *v1*, string *v2*)
*   boolean __greaterThan__(string *v1*, string *v2*)
*   boolean __lessThanOrEqual__(string *v1*, string *v2*)
*   boolean __greaterThanOrEqual__(string *v1*, string *v2*)

### Range Methods

*   boolean __ver.covers__(string *rangeCode*, string *version*)
*   boolean __ver.statisfy__(string *version*, string *rangeCode*)

##  Examples

Read the unit tests for examples of __ver.sion__:

*   [class Range](./test/range.js)
*   [comparators](./test/comparators.js)

##  Why *ver.sion*

In general, SemVer is enough. However, there are still version notations smiliar to SemVer but have more or less than three numbers. E.g., run the following command and observe components' versions in Node.js.

```bash
node -e 'console.log(process.versions)'
```

The output looks like,
```
{ http_parser: '2.7.0',
  node: '6.11.1',
  v8: '5.1.281.103',
  uv: '1.11.0',
  zlib: '1.2.11',
  ares: '1.10.1-DEV',
  icu: '58.2',
  modules: '48',
  openssl: '1.0.2k' }
```

With __ver.sion__, we can deal with versions made up of dots and numbers,  exceeding the restriction of *Major.Minor.Patch* as SemVer requires.

##  Honorable Dependents

Welcome to be honorable dependents of __ver.sion__!

##  References