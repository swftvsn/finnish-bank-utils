'use strict'

import FinnishBankUtils from '../src/finnish-bank-utils'
import {expect} from 'chai'


const barCodes = {
  '458101710000001220004829900000000559582243294671120131': {
    iban: 'FI58 1017 1000 0001 22',
    sum: '482.99',
    reference: '55958 22432 94671',
    date: '31.1.2012'
  },
  '402500046400013020006938000000069875672083435364110724': {
    iban: 'FI02 5000 4640 0013 02',
    sum: '693.8',
    reference: '69 87567 20834 35364',
    date: '24.7.2011'
  },
  '415660100015306410074445400000007758474790647489191219': {
    iban: 'FI15 6601 0001 5306 41',
    sum: '7444.54',
    reference: '7 75847 47906 47489',
    date: '19.12.2019'
  },
  '502500046400013020006938061000000000698756720839110724': {
    iban: 'FI02 5000 4640 0013 02',
    sum: '693.8',
    reference: 'RF61 6987 5672 0839',
    date: '24.7.2011'
  },
  '516800014000502670009358560000078777679656628687000000': {
    iban: 'FI16 8000 1400 0502 67',
    sum: '935.85',
    reference: 'RF60 7877 7679 6566 2868 7',
    date: undefined
  },
  '515660100015306410074445484000007758474790647489191219': {
    iban: 'FI15 6601 0001 5306 41',
    sum: '7444.54',
    reference: 'RF84 7758 4747 9064 7489',
    date: '19.12.2019'
  }
}


describe('finnish-bank-utils', () => {

  describe('#isValidFinnishRefNumber', () => {
    it('Should fail when given empty String', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('')).to.equal(false)
    })

    it('Should fail when given undefined', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber(undefined)).to.equal(false)
    })

    it('Should fail when given null String', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber(null)).to.equal(false)
    })

    it('Should fail when given too short refnumber (3 or 7 chars)', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('123')).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishRefNumber('RF12345')).to.equal(false)
    })

    it('Should fail when given too long refnumber (21 or 26 chars)', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('123456789012345678901')).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishRefNumber('RF123456789012345678901234')).to.equal(false)
    })

    it('Should pass when given valid refnumbers', () => {
      const validRefs = [
        '1234561',
        'RF341234561',
        '1511890656',
        '559582243294671',
        'RF601511890656',
        '3222190631525115',
        '1231180652526617',
        '01030100067175800018',
        'RF031030100067175800018',
        '3004101416423555',
        '77584747906474893225',
        'RF7677584747906474893225'
      ]
      validRefs.forEach(refNumber =>
        expect(FinnishBankUtils.isValidFinnishRefNumber(refNumber)).to.equal(true)
      )
    })

    it('Should pass when given valid refnumbers with whitespaces', () => {
      const validRefsWithSpace = [
        ' 123456 1 ',
        'RF34 1234 561',
        '15118 90656',
        '55958 22432 94671',
        'RF60 1511 8906 56',
        '3 22219 06315 25115',
        '1 23118 06525 26617',
        '0 10301 00067 17580 0018',
        'RF03 1030 1000 6717 5800 018',
        '3 00410 14164 23555',
        '77584 74790 64748 93225',
        'RF76 7758 4747 9064 7489 3225'
      ]
      validRefsWithSpace.forEach(refNumber =>
        expect(FinnishBankUtils.isValidFinnishRefNumber(refNumber)).to.equal(true)
      )
    })

    it('Should fail when given valid non finnish refnumber in international format', () => {
      expect(FinnishBankUtils.isValidFinnishRefNumber('RF97C2H5OH')).to.equal(false)
    })

  })

  describe('#isValidFinnishIBAN', () => {
    it('Should fail when given empty String', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN('')).to.equal(false)
    })

    it('Should fail when given undefined', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN(undefined)).to.equal(false)
    })

    it('Should fail when given null String', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN(null)).to.equal(false)
    })

    it('Should fail when given non String', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN({})).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(Date())).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(3)).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(['a'])).to.equal(false)
      expect(FinnishBankUtils.isValidFinnishIBAN(NaN)).to.equal(false)
    })

    it('Should fail when given almost valid bank number with nonsense in the end', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348A')).to.equal(false)
    })

    it('Should fail when given almost valid bank number with nonsense in the beginning', () => {
      expect(FinnishBankUtils.isValidFinnishIBAN('AFI9080002627761348')).to.equal(false)
    })

    it('Should pass when given valid bank number', () => {
      const validIBANs = [
        'FI9080002627761348',
        'FI2680003710241081',
        'FI2580003710241099',
        'FI4880003710241073',
        'FI0280003710211928',
        'FI3039390038674263',
        'FI7839390014047815',
        'FI2839390030337828',
        'FI7118203000008391',
        'FI5415713000030016',
        'FI0218803500006967'
      ]
      validIBANs.forEach(iban =>
        expect(FinnishBankUtils.isValidFinnishIBAN(iban)).to.equal(true)
      )
    })

    it('Should pass when given valid bank numbers with whitespace separators', () => {
      const validIBANs = [
        'FI 90 800026 2776 1348',
        'FI90 800026 27761348'
      ]
      validIBANs.forEach(iban =>
        expect(FinnishBankUtils.isValidFinnishIBAN(iban)).to.equal(true)
      )
    })
  })

  describe('#formatFinnishRefNumber', () => {
    it('Should return undefined when given empty String', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('')).to.equal(undefined)
    })

    it('Should return undefined when given undefined', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber(undefined)).to.equal(undefined)
    })

    it('Should return undefined when given null', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber(null)).to.equal(undefined)
    })

    it('Should return undefined when  given too short refnumber (3 or 7 chars)', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('123')).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishRefNumber('RF12345')).to.equal(undefined)
    })

    it('Should return undefined when given too long refnumber (21 or 26 chars)', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('123456789012345678901')).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishRefNumber('RF123456789012345678901234')).to.equal(undefined)
    })

    it('Should format correctly when given valid refnumbers', () => {
      const refs = {
        '1234561': '12 34561',
        'RF341234561': 'RF34 1234 561',
        '1511890656': '15118 90656',
        'RF60 1511 8906 56': 'RF60 1511 8906 56',
        '3222190631525115': '3 22219 06315 25115',
        '123 118 065 252 661 7': '1 23118 06525 26617',
        '01030100067175800018': '1030 10006 71758 00018',
        'RF031030100067175800018': 'RF03 1030 1000 6717 5800 018',
        '3004101416423555': '3 00410 14164 23555',
        '77584747906474893225': '77584 74790 64748 93225',
        'rf7677584747906474893225': 'RF76 7758 4747 9064 7489 3225'
      }
      Object.keys(refs).forEach(refNumber =>
        expect(FinnishBankUtils.formatFinnishRefNumber(refNumber)).to.equal(refs[refNumber])
      )
    })

    it('Should format with custom separator', () => {
      expect(FinnishBankUtils.formatFinnishRefNumber('RF7677584747906474893225', '.')).to.equal('RF76.7758.4747.9064.7489.3225')
      expect(FinnishBankUtils.formatFinnishRefNumber('77584747906474893225', '.')).to.equal('77584.74790.64748.93225')
    })

  })

  describe('#formatFinnishIBAN', () => {
    it('Should return undefined when given empty String', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('')).to.equal(undefined)
    })

    it('Should return undefined when given undefined', () => {
      expect(FinnishBankUtils.formatFinnishIBAN(undefined)).to.equal(undefined)
    })

    it('Should return undefined when given null', () => {
      expect(FinnishBankUtils.formatFinnishIBAN(null)).to.equal(undefined)
    })

    it('Should return undefined when given non String', () => {
      expect(FinnishBankUtils.formatFinnishIBAN({})).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(Date())).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(3)).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(['a'])).to.equal(undefined)
      expect(FinnishBankUtils.formatFinnishIBAN(NaN)).to.equal(undefined)
    })

    it('Should return undefined when given almost valid bank number with nonsense in the end', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('FI9080002627761348A')).to.equal(undefined)
    })

    it('Should return undefined when given almost valid bank number with nonsense in the beginning', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('AFI9080002627761348')).to.equal(undefined)
    })

    it('Should format correctly when given valid bank number', () => {
      const IBANs = {
        'FI9080002627761348': 'FI90 8000 2627 7613 48',
        'FI 268 000371024 1081': 'FI26 8000 3710 2410 81',
        'FI2580003710241099': 'FI25 8000 3710 2410 99',
        ' FI4880003710241073 ': 'FI48 8000 3710 2410 73',
        'fi0280003710211928': 'FI02 8000 3710 2119 28',
        'FI3039390038674263': 'FI30 3939 0038 6742 63',
        'FI7839390014047815': 'FI78 3939 0014 0478 15',
        'FI2839390030337828': 'FI28 3939 0030 3378 28',
        'FI7118203000008391': 'FI71 1820 3000 0083 91',
        'FI5415713000030016': 'FI54 1571 3000 0300 16',
        'FI0218803500006967': 'FI02 1880 3500 0069 67'
      }
      Object.keys(IBANs).forEach(iban =>
        expect(FinnishBankUtils.formatFinnishIBAN(iban)).to.equal(IBANs[iban])
      )
    })

    it('Should format with custom separator', () => {
      expect(FinnishBankUtils.formatFinnishIBAN('FI7839390014047815', '.')).to.equal('FI78.3939.0014.0478.15')
    })
  })

  describe('#generateFinnishRefNumber', () => {
    it('Should return valid reference number foreach given string', function(){
      const initialStrings = [
        '1234561',
        '1511890656',
        '559582243294671',
        '3222190631525115',
        '1231',
        '0103010006717580001',
        '3004101416423555',
        '7758474790647489322',
      ]
      initialStrings.forEach(str => {
        const ref = FinnishBankUtils.generateFinnishRefNumber(str)
        expect(ref.indexOf(str)).to.be.above(-1)
        expect(FinnishBankUtils.isValidFinnishRefNumber(ref)).to.equal(true)
      })
    });

    it('Should create valid random reference number with a sample of 10000', () => {
      for (let i = 0; i < 10000; i++) {
        const generated = FinnishBankUtils.generateFinnishRefNumber()
        expect(FinnishBankUtils.isValidFinnishRefNumber(generated)).to.equal(true)
      }
    })

  })

  describe('#generateFinnishIBAN', () => {
    it('Should create valid finnish IBAN number with a sample of 10000', () => {
      for (let i = 0; i < 10000; i++) {
        const generated = FinnishBankUtils.generateFinnishIBAN()
        expect(FinnishBankUtils.isValidFinnishIBAN(generated)).to.equal(true)
      }
    })
  })

  describe('#parseFinnishVirtualBarCode', () => {
    it('Should return false when given empty String', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode('')).to.equal(false)
    })

    it('Should return false when given undefined', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode(undefined)).to.equal(false)
    })

    it('Should return false when given null', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode(null)).to.equal(false)
    })

    it('Should return false when given non String', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode({})).to.equal(false)
      expect(FinnishBankUtils.parseFinnishVirtualBarCode(Date())).to.equal(false)
      expect(FinnishBankUtils.parseFinnishVirtualBarCode(3)).to.equal(false)
      expect(FinnishBankUtils.parseFinnishVirtualBarCode(['a'])).to.equal(false)
      expect(FinnishBankUtils.parseFinnishVirtualBarCode(NaN)).to.equal(false)
    })

    it('Should return false when given almost valid bar code with letters in the end', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode('4581017100000012200048299000000005595822432946711201AA')).to.equal(false)
    })

    it('Should return false when given too short bar code', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode('45810171000000122000482990000000055958224329467112013')).to.equal(false)
    })

    it('Should return false when given too long bar code', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode('4581017100000012200048299000000005595822432946711201312')).to.equal(false)
    })

    it('Should return false when given bar code with version 3', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode('300000000000000000000000000000000000000000000000000000')).to.equal(false)
    })

    it('Should return false when given bar code with version 6', () => {
      expect(FinnishBankUtils.parseFinnishVirtualBarCode('600000000000000000000000000000000000000000000000000000')).to.equal(false)
    })

    it('Should return correctly when given valid bank bar codes', () => {
      Object.keys(barCodes).forEach(barCode =>
        expect(FinnishBankUtils.parseFinnishVirtualBarCode(barCode)).to.deep.equal(barCodes[barCode])
      )
    })
  })

  describe('#formatFinnishVirtualBarCode', () => {
    const VALID_OBJECT = {
      iban: 'FI15 6601 0001 5306 41',
      sum: '7444.54',
      reference: 'RF84 7758 4747 9064 7489',
      date: '19.12.2019'
    }

    it('Should return false when given undefined', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode(undefined)).to.equal(false)
    })

    it('Should return false when given null', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode(null)).to.equal(false)
    })

    it('Should return false when given empty Object', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({})).to.equal(false)
    })

    it('Should return false when given wrong type of Object', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode(Date())).to.equal(false)
      expect(FinnishBankUtils.formatFinnishVirtualBarCode('')).to.equal(false)
      expect(FinnishBankUtils.formatFinnishVirtualBarCode(['a'])).to.equal(false)
      expect(FinnishBankUtils.formatFinnishVirtualBarCode(NaN)).to.equal(false)
    })

    it('Should return a bar code when given valid object', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode(VALID_OBJECT)).to.equal('515660100015306410074445484000007758474790647489191219')
    })

    it('Should return false when given no iban', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, iban: undefined})).to.equal(false)
    })

    it('Should return false when given invalid iban', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, iban: 'FI15 6601 0001 5306 42'})).to.equal(false)
    })

    it('Should return false when given no sum', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: undefined})).to.equal(false)
    })

    it('Should return false when given negative sum', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: '-1'})).to.equal(false)
    })

    it('Should return false when given too large sum', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: '1000000'})).to.equal(false)
    })

    it('Should return false when given NaN as sum', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: NaN})).to.equal(false)
    })

    it('Should return a bar code when given sum with no decimals', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: '123'})).to.equal('515660100015306410001230084000007758474790647489191219')
    })

    it('Should return false when given no reference', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, reference: undefined})).to.equal(false)
    })

    it('Should return false when given invalid reference', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, reference: 'RF84 7758 4747 9064 7480'})).to.equal(false)
    })

    it('Should return a bar code without date when given no date', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, date: undefined})).to.equal('515660100015306410074445484000007758474790647489000000')
    })

    it('Should return false when given invalid day', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, date: '32.12.2016'})).to.equal(false)
    })

    it('Should return false when given invalid month', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, date: '31.13.2016'})).to.equal(false)
    })

    it('Should return a bar code when given date with leading zeros', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, date: '01.06.2019'})).to.equal('515660100015306410074445484000007758474790647489190601')
    })

    it('Should return correctly when given valid parameters', () => {
      Object.keys(barCodes).forEach(barCode =>
        expect(FinnishBankUtils.formatFinnishVirtualBarCode(barCodes[barCode])).to.equal(barCode)
      )
    })

    it('Should return false when given sum with too many decimals', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: '123.123'})).to.equal(false)
    })

    it('Should return false when given sum with too many decimals 2', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({...VALID_OBJECT, sum: '450.459999999999999927'})).to.equal(false)
    })

    it('Should return false when given sum with too many decimals 3', () => {
      expect(FinnishBankUtils.formatFinnishVirtualBarCode({iban: 'FI58 1017 1000 0001 22', sum: '482.9999999998', reference: '55958 22432 94671', date: '31.1.2012'})).to.equal(false)
    })

  })

})

