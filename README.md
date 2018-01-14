[![Build Status](https://travis-ci.org/vkomulai/finnish-bank-utils.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-bank-utils) ![0 deps](https://david-dm.org/vkomulai/finnish-bank-utils.svg) ![Downloads](https://img.shields.io/npm/dt/finnish-bank-utils.svg) ![License](https://img.shields.io/npm/l/finnish-bank-utils.svg)

- A micro Javascript library for validating, creating and formatting Finnish IBAN bank account numbers and reference numbers
- Lightweight, 5.2kB
- No dependencies

Installation
------------

```sh
# NPM / yarn
npm install finnish-bank-utils
yarn install finnish-bank-utils

# Bower
bower install finnish-bank-utils
```

```html
<!-- From unpkg.com -->
<script src="https://unpkg.com/finnish-bank-utils/finnish-bank-utils.min.js"></script>
```

Usage
-----

Node.js

``` js
const FinnishBankUtils = require('finnish-bank-utils')
FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
```

Browser: Writes FinnishBankUtils into global namespace.

``` html
<script src="finnish-bank-utils.min.js"></script>
<script>
  FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
</script>
```

Examples
--------

```js
# Valid IBAN returns true, allows whitespace
FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
FinnishBankUtils.isValidFinnishIBAN('FI 90 800026 2776 1348')
```

```js
# Valid reference number returns true, allows whitespace
# !! Reference number type must be a string !!
FinnishBankUtils.isValidFinnishRefNumber('1511890656')
FinnishBankUtils.isValidFinnishRefNumber('15118 90656')

# Allow international format for local reference number
FinnishBankUtils.isValidFinnishRefNumber('RF34 1234 561')
```

```js
# Valid IBAN returns formatted version, allows whitespace
FinnishBankUtils.formatFinnishIBAN('FI9080002627761348')
// 'FI90 8000 2627 7613 48'
```

```js
# Valid reference number returns formatted version, allows whitespace
FinnishBankUtils.formatFinnishRefNumber('1511890656')
// '15118 90656'
FinnishBankUtils.formatFinnishRefNumber('RF341234561')
// 'RF34 1234 561'
```

```js
# Format Finnish virtual bar code (virtuaaliviidakoodi, pankkiviivakoodi)
# Supports versions 4 and 5
FinnishBankUtils.formatFinnishVirtualBarCode({iban: 'FI58 1017 1000 0001 22', sum: 482.99, reference: '55958 22432 94671', date: '31.1.2012'})
// '458101710000001220004829900000000559582243294671120131'
FinnishBankUtils.formatFinnishVirtualBarCode({iban: 'FI02 5000 4640 0013 02', sum: 693.8, reference: 'RF61 6987 5672 0839', date: '24.7.2011'})
// '502500046400013020006938061000000000698756720839110724'
```

```js
# Parse Finnish virtual bar code (virtuaaliviidakoodi, pankkiviivakoodi)
# Supports versions 4 and 5
FinnishBankUtils.parseFinnishVirtualBarCode('458101710000001220004829900000000559582243294671120131')
// {iban: 'FI58 1017 1000 0001 22', sum: 482.99, reference: '55958 22432 94671', date: '31.1.2012'}
FinnishBankUtils.parseFinnishVirtualBarCode('502500046400013020006938061000000000698756720839110724')
// {iban: 'FI02 5000 4640 0013 02', sum: 693.8, reference: 'RF61 6987 5672 0839', date: '24.7.2011'}
```

```js
# Generate a Finnish reference number
FinnishBankUtils.generateFinnishRefNumber()
// '6173672848'

FinnishBankUtils.generateFinnishRefNumber('617367284')
// '6173672848'
```

```js
# Generate a Finnish IBAN
FinnishBankUtils.generateFinnishRefIBAN()
// 'FI9080002627761348'
```

Functions
---------

##### isValidFinnishRefNumber(referenceNumber) : string --> boolean
- Validates parameter given reference number

##### isValidFinnishIBAN(ibanNumber) : string --> boolean
- Validates parameter given Finnish IBAN number

##### formatFinnishRefNumber(referenceNumber) : string --> string
- Formats parameter given reference number

##### formatFinnishIBAN(ibanNumber) : string --> string
- Formats parameter given Finnish IBAN number

##### formatFinnishVirtualBarCode({iban : string, sum : number, reference : string, date : string}) : object --> string
- Formats parameters to Finnish virtual bar code

##### parseFinnishVirtualBarCode(barCode) : string --> object
- Parses parameter given Finnish virtual bar code

##### generateFinnishRefNumber(initial) : string|void --> string
- Generates a (possibly random 10 char long) Finnish reference number.

##### generateFinnishIBAN() : void --> string
- Generates a random Finnish IBAN number

Building
--------

```sh
# Build a distributable, minified UMD library compatible with browsers and Node
npm run dist

# Run tests
npm run test
```

License
-------
[MIT License](LICENSE)
