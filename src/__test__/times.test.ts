import { expect, test } from 'vitest'
import { strNumber, StrNumber } from '../strnumber'

const { times } = strNumber

test('不同的调用方式', () => {
  expect(strNumber.times === StrNumber.times).toBe(true)
})

test('常规场景', () => {
  expect(times(12, 3)).toBe('36')
  expect(times(-6, 7)).toBe('-42')
  expect(times(999, 999)).toBe('998001')
  expect(times(0.1, 0.2)).toBe('0.02')
  expect(times(123.456, 0)).toBe('0')
  expect(times('1e+50', '2e+30')).toBe(
    '200000000000000000000000000000000000000000000000000000000000000000000000000000000'
  )
})

test('不同的传参方式', () => {
  expect(times(1, 2)).toBe('2')
  expect(times('1', 2)).toBe('2')
  expect(times(1, '2')).toBe('2')
  expect(times(strNumber(1), '2')).toBe('2')
  expect(times(1, new StrNumber('2'))).toBe('2')
})

test('小整数相乘', () => {
  expect(times(1, 2)).toBe('2')
  expect(times(100000, 20)).toBe('2000000')
  expect(times(-100000, 20)).toBe('-2000000')
  expect(times(-100000, -20)).toBe('2000000')
  expect(times(100000, -20)).toBe('-2000000')
})

test('大整数相乘', () => {
  expect(times('1234567890123456789', '20')).toBe('24691357802469135780')
  expect(times('-1234567890123456789', '20')).toBe('-24691357802469135780')
  expect(times('-1234567890123456789', '-20')).toBe('24691357802469135780')
  expect(times('1234567890123456789', '-20')).toBe('-24691357802469135780')
  expect(times('1234567890123456789', '1234567890123456788')).toBe(
    '1524157875323883673784484108626733732'
  )
  expect(times('-1234567890123456789', '1234567890123456788')).toBe(
    '-1524157875323883673784484108626733732'
  )
  expect(times('-1234567890123456789', '-1234567890123456788')).toBe(
    '1524157875323883673784484108626733732'
  )
  expect(times('1234567890123456789', '-1234567890123456788')).toBe(
    '-1524157875323883673784484108626733732'
  )
})

test('小数相乘', () => {
  expect(times('1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '24691357802469135782.64912978264912978264912978264912978'
  )
  expect(times('-1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '-24691357802469135782.64912978264912978264912978264912978'
  )
  expect(times('-1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '24691357802469135782.64912978264912978264912978264912978'
  )
  expect(times('1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '-24691357802469135782.64912978264912978264912978264912978'
  )
  expect(
    times(
      '1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '1524157875323883675346105055393025303.288687145784438986718569884009651101833006159337254316841502474345750632'
  )
  expect(
    times(
      '-1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '-1524157875323883675346105055393025303.288687145784438986718569884009651101833006159337254316841502474345750632'
  )
  expect(
    times(
      '-1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '1524157875323883675346105055393025303.288687145784438986718569884009651101833006159337254316841502474345750632'
  )
  expect(
    times(
      '1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '-1524157875323883675346105055393025303.288687145784438986718569884009651101833006159337254316841502474345750632'
  )
})

test('特殊数字相乘', () => {
  expect(times(Infinity, -Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(times(Infinity, 0)).toBe(strNumber.NaN)
  expect(times(Infinity, -0)).toBe(strNumber.NaN)
  expect(times(Infinity, NaN)).toBe(strNumber.NaN)
  expect(times(-Infinity, 0)).toBe(strNumber.NaN)
  expect(times(-Infinity, -0)).toBe(strNumber.NaN)
  expect(times(-Infinity, NaN)).toBe(strNumber.NaN)
  expect(times(0, -0)).toBe('-0')
  expect(times(0, NaN)).toBe(strNumber.NaN)
  expect(times(-0, NaN)).toBe(strNumber.NaN)
  expect(times(-Infinity, Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(times(0, Infinity)).toBe(strNumber.NaN)
  expect(times(-0, Infinity)).toBe(strNumber.NaN)
  expect(times(NaN, Infinity)).toBe(strNumber.NaN)
  expect(times(0, -Infinity)).toBe(strNumber.NaN)
  expect(times(-0, -Infinity)).toBe(strNumber.NaN)
  expect(times(NaN, -Infinity)).toBe(strNumber.NaN)
  expect(times(-0, 0)).toBe('-0')
  expect(times(NaN, 0)).toBe(strNumber.NaN)
  expect(times(NaN, -0)).toBe(strNumber.NaN)
  expect(times(Infinity, Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(times(-Infinity, -Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(times(0, 0)).toBe('0')
  expect(times(-0, -0)).toBe('0')
  expect(times(NaN, NaN)).toBe(strNumber.NaN)

  expect(times(strNumber.POSITIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(
    strNumber.NEGATIVE_INFINITY
  )
  expect(times(strNumber.POSITIVE_INFINITY, '0')).toBe(strNumber.NaN)
  expect(times(strNumber.POSITIVE_INFINITY, '-0')).toBe(strNumber.NaN)
  expect(times(strNumber.POSITIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(times(strNumber.NEGATIVE_INFINITY, '0')).toBe(strNumber.NaN)
  expect(times(strNumber.NEGATIVE_INFINITY, '-0')).toBe(strNumber.NaN)
  expect(times(strNumber.NEGATIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(times('0', '-0')).toBe('-0')
  expect(times('0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(times('-0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(times(strNumber.NEGATIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(
    strNumber.NEGATIVE_INFINITY
  )
  expect(times('0', strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(times('-0', strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(times(strNumber.NaN, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(times('0', strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(times('-0', strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(times(strNumber.NaN, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(times('-0', '0')).toBe('-0')
  expect(times(strNumber.NaN, '0')).toBe(strNumber.NaN)
  expect(times(strNumber.NaN, '-0')).toBe(strNumber.NaN)
  expect(times(strNumber.POSITIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(
    strNumber.POSITIVE_INFINITY
  )
  expect(times(strNumber.NEGATIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(
    strNumber.POSITIVE_INFINITY
  )
  expect(times('0', '0')).toBe('0')
  expect(times('-0', '-0')).toBe('0')
  expect(times(strNumber.NaN, strNumber.NaN)).toBe(strNumber.NaN)
})
