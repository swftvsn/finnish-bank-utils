(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('FinnishBankUtils', ['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.FinnishBankUtils = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var REF_NUMBER_MULTIPLIERS = [7, 3, 1],
      REF_NUMBER_REGEX = /^(\d{4,20}|RF\d{6,23})$/i,
      FINNISH_IBAN_REGEX = /^FI\d{16}$/,
      IBAN_OFFSET_FROM_ASCIICODE = -55;

  function removeAllWhiteSpaces(str) {
    return str.replace(/\s+/g, '');
  }

  function removeLeadingZeros(str) {
    return str.replace(/^0+/, '');
  }

  function lettersToNumbers(str) {
    return [].concat(_toConsumableArray(str)).map(function (char) {
      if (/\D/.test(char)) {
        return String(char.charCodeAt(0) + IBAN_OFFSET_FROM_ASCIICODE);
      }
      return char;
    }).join('');
  }

  function reverseString(str) {
    return [].concat(_toConsumableArray(str)).reverse().join('');
  }

  function removeStringFromEnd(str, strToRemove) {
    if (str.substr(-strToRemove.length) === strToRemove) {
      return str.substr(0, str.length - strToRemove.length);
    }
    return str;
  }

  function randomNumberWithLength(length) {
    var randomNumber = '';
    for (var i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 9) + 1; // 1...9, because a real number can't begin with zero
    }
    return parseInt(randomNumber, 10);
  }

  /** JS number type can't handle the long account numbers... */
  function modForLargeNumber(base, divisor) {
    var dividend = '';
    for (var i = 0; i < base.length; i++) {
      dividend = parseInt(dividend + base[i], 10);
      if (dividend >= divisor) {
        var remainder = dividend % divisor;
        if (i == base.length - 1) {
          return remainder;
        } else {
          dividend = remainder;
        }
      }
    }
    return parseInt(dividend, 10);
  }

  /** Luhn mod 10 checksum algorithm https://en.wikipedia.org/wiki/Luhn_algorithm */
  function luhnMod10(value) {
    var sum = 0;
    for (var i = 0; i < value.length; i++) {
      var multiplier = i % 2 === 0 ? 2 : 1;
      var add = multiplier * parseInt(value[i], 10);
      if (add >= 10) {
        add -= 9;
      }
      sum += add;
    }
    var mod10 = sum % 10;
    return mod10 === 0 ? mod10 : 10 - mod10;
  }

  function isValidFinnishBBAN(accountNumber) {
    accountNumber = removeAllWhiteSpaces(accountNumber);
    var localAccountNumberWithoutCheckSum = accountNumber.substr(4, 13),
        luhnChecksumChar = parseInt(accountNumber.substr(17, 1), 10);

    return luhnMod10(localAccountNumberWithoutCheckSum) === luhnChecksumChar;
  }

  function isValidIBAN(iban) {
    iban = removeAllWhiteSpaces(iban.toUpperCase());
    var prefixAndChecksum = iban.substr(0, 4),
        number = iban.substr(4);

    return modForLargeNumber(lettersToNumbers(number + prefixAndChecksum), 97) === 1;
  }

  function sliceVirtualBarCode(barCode) {
    var version = barCode.substr(0, 1);
    var slices = void 0;
    if (version == 4) {
      slices = [1, 16, 6, 2, 3, 20, 2, 2, 2];
    } else if (version == 5) {
      slices = [1, 16, 6, 2, 0, 23, 2, 2, 2];
    } else {
      return;
    }
    var index = 0;
    return slices.map(function (length) {
      var slice = barCode.substr(index, length);
      index += length;
      return slice;
    });
  }

  var FinnishBankUtils = {
    isValidFinnishRefNumber: function isValidFinnishRefNumber(refNumber) {
      //  Sanity and format check, which allows to make safe assumptions on the format.
      if (!refNumber || typeof refNumber !== 'string' || !REF_NUMBER_REGEX.test(removeAllWhiteSpaces(refNumber.toUpperCase()))) {
        return false;
      }

      refNumber = removeAllWhiteSpaces(refNumber.toUpperCase());

      if (/^RF/.test(refNumber)) {
        if (!isValidIBAN(refNumber)) {
          return false;
        }
        refNumber = refNumber.substr(4);
      } else {
        refNumber = removeLeadingZeros(refNumber);
      }

      var reversedRefNumber = reverseString(refNumber),
          providedChecksumNumber = parseInt(reversedRefNumber.charAt(0));

      refNumber = reversedRefNumber.substr(1);

      var checksum = 0,
          checksumNumber = void 0;

      for (var i = 0; i < refNumber.length; i++) {
        checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(refNumber.charAt(i));
      }

      checksumNumber = 10 - checksum % 10;

      if (checksumNumber === 10) {
        checksumNumber = 0;
      }

      return checksumNumber === providedChecksumNumber;
    },
    isValidFinnishIBAN: function isValidFinnishIBAN(accountNumber) {
      if (!accountNumber || typeof accountNumber !== 'string' || !FINNISH_IBAN_REGEX.test(removeAllWhiteSpaces(accountNumber.toUpperCase()))) {
        return false;
      }

      return isValidFinnishBBAN(accountNumber) && isValidIBAN(accountNumber);
    },
    formatFinnishRefNumber: function formatFinnishRefNumber(refNumber) {
      var separator = arguments.length <= 1 || arguments[1] === undefined ? ' ' : arguments[1];

      if (this.isValidFinnishRefNumber(refNumber)) {
        refNumber = removeAllWhiteSpaces(refNumber.toUpperCase());
        if (/^RF/.test(refNumber)) {
          refNumber = refNumber.substr(0, 4) + removeLeadingZeros(refNumber.substr(4));
          return removeStringFromEnd(refNumber.replace(/.{4}/g, '$&' + separator), separator);
        } else {
          refNumber = removeLeadingZeros(refNumber);
          return reverseString(removeStringFromEnd(reverseString(refNumber).replace(/.{5}/g, '$&' + separator), separator));
        }
      }
    },
    formatFinnishIBAN: function formatFinnishIBAN(accountNumber) {
      var separator = arguments.length <= 1 || arguments[1] === undefined ? ' ' : arguments[1];

      if (this.isValidFinnishIBAN(accountNumber)) {
        accountNumber = removeAllWhiteSpaces(accountNumber.toUpperCase());
        return removeStringFromEnd(accountNumber.replace(/.{4}/g, '$&' + separator), separator);
      }
    },
    generateFinnishRefNumber: function generateFinnishRefNumber() {
      var refNumber = randomNumberWithLength(9).toString(),
          reversedRefNumber = reverseString(refNumber);

      var checksum = 0,
          checksumNumber = void 0;

      for (var i = 0; i < reversedRefNumber.length; i++) {
        checksum += REF_NUMBER_MULTIPLIERS[i % REF_NUMBER_MULTIPLIERS.length] * parseInt(reversedRefNumber.charAt(i));
      }

      checksumNumber = 10 - checksum % 10;

      if (checksumNumber === 10) {
        checksumNumber = 0;
      }

      return refNumber + checksumNumber;
    },
    generateFinnishIBAN: function generateFinnishIBAN() {
      var defaultCheckDigit = '00',
          danskeBankOffice = '800026',
          //  Use a real bank and office for simplicity
      countryCodeInDigits = lettersToNumbers('FI'),
          bankAccount = randomNumberWithLength(7),
          localAccountNumber = danskeBankOffice + bankAccount + luhnMod10(danskeBankOffice + bankAccount),
          accountNumberCandidate = localAccountNumber + countryCodeInDigits + defaultCheckDigit,
          checkDigit = 98 - modForLargeNumber(accountNumberCandidate, 97),
          checkChars = checkDigit >= 10 ? checkDigit.toString() : '0' + checkDigit;

      return 'FI' + checkChars + localAccountNumber;
    },
    parseFinnishVirtualBarCode: function parseFinnishVirtualBarCode(barCode) {
      if (!barCode || typeof barCode != 'string' || barCode.length != 54 || !/^\d+$/.test(barCode)) {
        return false;
      }

      var sliced = sliceVirtualBarCode(barCode);

      if (!sliced) {
        return false;
      }

      var _sliced = _slicedToArray(sliced, 9);

      var version = _sliced[0];
      var iban = _sliced[1];
      var euros = _sliced[2];
      var cents = _sliced[3];
      var reserve = _sliced[4];
      var reference = _sliced[5];
      var year = _sliced[6];
      var month = _sliced[7];
      var day = _sliced[8];


      iban = this.formatFinnishIBAN('FI' + iban);
      var sum = Number(euros) + Number(cents) / 100;

      if (version == 5) {
        reference = 'RF' + reference.substr(0, 2) + removeLeadingZeros(reference.substr(2));
      }
      reference = this.formatFinnishRefNumber(reference);

      var date = void 0;
      day = Number(day);
      month = Number(month);
      if (day > 0 && month > 0) {
        date = day + '.' + month + '.20' + year;
      }

      return { iban: iban, sum: sum, reference: reference, date: date };
    }
  };

  module.exports = Object.freeze(FinnishBankUtils);
});

