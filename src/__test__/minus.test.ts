import { expect, test } from 'vitest'
import { strNumber, StrNumber } from '../strnumber'

const { minus } = strNumber

test('不同的调用方式', () => {
  expect(strNumber.minus === StrNumber.minus).toBe(true)
})

test('不同的传参方式', () => {
  expect(minus(1, 2)).toBe('-1')
  expect(minus('1', 2)).toBe('-1')
  expect(minus(1, '2')).toBe('-1')
  expect(minus(strNumber(1), '2')).toBe('-1')
  expect(minus(1, new StrNumber('2'))).toBe('-1')
})

test('小整数相减', () => {
  expect(minus(1, 2)).toBe('-1')
  expect(minus(100000, 20)).toBe('99980')
  expect(minus(-100000, 20)).toBe('-100020')
  expect(minus(-100000, -20)).toBe('-99980')
  expect(minus(100000, -20)).toBe('100020')
})

test('相等数相减', () => {
  expect(minus(1, 1)).toBe('0')
  expect(minus(1000, 1000)).toBe('0')
  expect(minus(0, 0)).toBe('0')
  expect(minus(-0, -0)).toBe('0')
  expect(minus(-1, -1)).toBe('0')
  expect(minus(-1000, -1000)).toBe('0')
})

test('大整数相减', () => {
  expect(minus('1234567890123456789', '20')).toBe('1234567890123456769')
  expect(minus('-1234567890123456789', '20')).toBe('-1234567890123456809')
  expect(minus('-1234567890123456789', '-20')).toBe('-1234567890123456769')
  expect(minus('1234567890123456789', '-20')).toBe('1234567890123456809')
  expect(minus('1234567890123456789', '1234567890123456788')).toBe('1')
  expect(minus('-1234567890123456789', '1234567890123456788')).toBe('-2469135780246913577')
  expect(minus('-1234567890123456789', '-1234567890123456788')).toBe('-1')
  expect(minus('1234567890123456789', '-1234567890123456788')).toBe('2469135780246913577')
})

test('小数相减', () => {
  expect(minus('1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '1234567890123456769.132456489132456489132456489132456489'
  )
  expect(minus('-1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '-1234567890123456809.132456489132456489132456489132456489'
  )
  expect(minus('-1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '-1234567890123456769.132456489132456489132456489132456489'
  )
  expect(minus('1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '1234567890123456809.132456489132456489132456489132456489'
  )
  expect(
    minus(
      '1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('0.000000000000000000000000000000000001')
  expect(
    minus(
      '-1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('-2469135780246913578.264912978264912978264912978264912977')
  expect(
    minus(
      '-1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('-0.000000000000000000000000000000000001')
  expect(
    minus(
      '1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('2469135780246913578.264912978264912978264912978264912977')
})

test('特殊数字相减', () => {
  expect(minus(Infinity, -Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(Infinity, 0)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(Infinity, -0)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(Infinity, NaN)).toBe(strNumber.NaN)
  expect(minus(-Infinity, 0)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(-Infinity, -0)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(-Infinity, NaN)).toBe(strNumber.NaN)
  expect(minus(0, -0)).toBe('0')
  expect(minus(0, NaN)).toBe(strNumber.NaN)
  expect(minus(-0, NaN)).toBe(strNumber.NaN)
  expect(minus(-Infinity, Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(0, Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(-0, Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(NaN, Infinity)).toBe(strNumber.NaN)
  expect(minus(0, -Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(-0, -Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(NaN, -Infinity)).toBe(strNumber.NaN)
  expect(minus(-0, 0)).toBe('-0')
  expect(minus(NaN, 0)).toBe(strNumber.NaN)
  expect(minus(NaN, -0)).toBe(strNumber.NaN)
  expect(minus(Infinity, Infinity)).toBe(strNumber.NaN)
  expect(minus(-Infinity, -Infinity)).toBe(strNumber.NaN)
  expect(minus(0, 0)).toBe('0')
  expect(minus(-0, -0)).toBe('0')
  expect(minus(NaN, NaN)).toBe(strNumber.NaN)

  expect(minus(strNumber.POSITIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(
    strNumber.POSITIVE_INFINITY
  )
  expect(minus(strNumber.POSITIVE_INFINITY, '0')).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(strNumber.POSITIVE_INFINITY, '-0')).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(strNumber.POSITIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(minus(strNumber.NEGATIVE_INFINITY, '0')).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(strNumber.NEGATIVE_INFINITY, '-0')).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(strNumber.NEGATIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(minus('0', '-0')).toBe('0')
  expect(minus('0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(minus('-0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(minus(strNumber.NEGATIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(
    strNumber.NEGATIVE_INFINITY
  )
  expect(minus('0', strNumber.POSITIVE_INFINITY)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus('-0', strNumber.POSITIVE_INFINITY)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(minus(strNumber.NaN, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(minus('0', strNumber.NEGATIVE_INFINITY)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus('-0', strNumber.NEGATIVE_INFINITY)).toBe(strNumber.POSITIVE_INFINITY)
  expect(minus(strNumber.NaN, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(minus('-0', '0')).toBe('-0')
  expect(minus(strNumber.NaN, '0')).toBe(strNumber.NaN)
  expect(minus(strNumber.NaN, '-0')).toBe(strNumber.NaN)
  expect(minus(strNumber.POSITIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(minus(strNumber.NEGATIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(minus('0', '0')).toBe('0')
  expect(minus('-0', '-0')).toBe('0')
  expect(minus(strNumber.NaN, strNumber.NaN)).toBe(strNumber.NaN)
})
