import { expect, test } from 'vitest'
import { strNumber, StrNumber } from '../strnumber'

const { add } = strNumber

test('不同的调用方式', () => {
  expect(strNumber.add === StrNumber.add).toBe(true)
})

test('常规场景', () => {
  expect(add(123, 456)).toBe('579')
  expect(add(999, 1)).toBe('1000')
  expect(add(123.456, 0.544)).toBe('124')
  expect(add(-100, 50)).toBe('-50')
  expect(add(-200, -300)).toBe('-500')
  expect(add(100, -99.99)).toBe('0.01')
  expect(add(0, 0)).toBe('0')
  expect(add('999999999999999999', 1)).toBe('1000000000000000000')
  expect(add('0.9999999999', '0.0000000001')).toBe('1')
})

test('不同的传参方式', () => {
  expect(add(1, 2)).toBe('3')
  expect(add('1', 2)).toBe('3')
  expect(add(1, '2')).toBe('3')
  expect(add(strNumber(1), '2')).toBe('3')
  expect(add(1, new StrNumber('2'))).toBe('3')
})

test('小整数相加', () => {
  expect(add(1, 2)).toBe('3')
  expect(add(100000, 20)).toBe('100020')
  expect(add(-100000, 20)).toBe('-99980')
  expect(add(-100000, -20)).toBe('-100020')
  expect(add(100000, -20)).toBe('99980')
})

test('大整数相加', () => {
  expect(add('1234567890123456789', '20')).toBe('1234567890123456809')
  expect(add('-1234567890123456789', '20')).toBe('-1234567890123456769')
  expect(add('-1234567890123456789', '-20')).toBe('-1234567890123456809')
  expect(add('1234567890123456789', '-20')).toBe('1234567890123456769')
  expect(add('1234567890123456789', '1234567890123456788')).toBe('2469135780246913577')
  expect(add('-1234567890123456789', '1234567890123456788')).toBe('-1')
  expect(add('-1234567890123456789', '-1234567890123456788')).toBe('-2469135780246913577')
  expect(add('1234567890123456789', '-1234567890123456788')).toBe('1')
})

test('小数相加', () => {
  expect(add('1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '1234567890123456809.132456489132456489132456489132456489'
  )
  expect(add('-1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '-1234567890123456769.132456489132456489132456489132456489'
  )
  expect(add('-1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '-1234567890123456809.132456489132456489132456489132456489'
  )
  expect(add('1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '1234567890123456769.132456489132456489132456489132456489'
  )
  expect(
    add(
      '1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('2469135780246913578.264912978264912978264912978264912977')
  expect(
    add(
      '-1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('-0.000000000000000000000000000000000001')
  expect(
    add(
      '-1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('-2469135780246913578.264912978264912978264912978264912977')
  expect(
    add(
      '1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe('0.000000000000000000000000000000000001')
})

test('特殊数字相加', () => {
  expect(add(Infinity, -Infinity)).toBe(strNumber.NaN)
  expect(add(Infinity, 0)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(Infinity, -0)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(Infinity, NaN)).toBe(strNumber.NaN)
  expect(add(-Infinity, 0)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(-Infinity, -0)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(-Infinity, NaN)).toBe(strNumber.NaN)
  expect(add(0, -0)).toBe('0')
  expect(add(0, NaN)).toBe(strNumber.NaN)
  expect(add(-0, NaN)).toBe(strNumber.NaN)
  expect(add(-Infinity, Infinity)).toBe(strNumber.NaN)
  expect(add(0, Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(-0, Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(NaN, Infinity)).toBe(strNumber.NaN)
  expect(add(0, -Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(-0, -Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(NaN, -Infinity)).toBe(strNumber.NaN)
  expect(add(-0, 0)).toBe('0')
  expect(add(NaN, 0)).toBe(strNumber.NaN)
  expect(add(NaN, -0)).toBe(strNumber.NaN)
  expect(add(Infinity, Infinity)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(-Infinity, -Infinity)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(0, 0)).toBe('0')
  expect(add(-0, -0)).toBe('-0')
  expect(add(NaN, NaN)).toBe(strNumber.NaN)

  expect(add(strNumber.POSITIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(add(strNumber.POSITIVE_INFINITY, '0')).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(strNumber.POSITIVE_INFINITY, '-0')).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(strNumber.POSITIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(add(strNumber.NEGATIVE_INFINITY, '0')).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(strNumber.NEGATIVE_INFINITY, '-0')).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(strNumber.NEGATIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(add('0', '-0')).toBe('0')
  expect(add('0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(add('-0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(add(strNumber.NEGATIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(add('0', strNumber.POSITIVE_INFINITY)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add('-0', strNumber.POSITIVE_INFINITY)).toBe(strNumber.POSITIVE_INFINITY)
  expect(add(strNumber.NaN, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(add('0', strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add('-0', strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(add(strNumber.NaN, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(add('-0', '0')).toBe('0')
  expect(add(strNumber.NaN, '0')).toBe(strNumber.NaN)
  expect(add(strNumber.NaN, '-0')).toBe(strNumber.NaN)
  expect(add(strNumber.POSITIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(
    strNumber.POSITIVE_INFINITY
  )
  expect(add(strNumber.NEGATIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(
    strNumber.NEGATIVE_INFINITY
  )
  expect(add('0', '0')).toBe('0')
  expect(add('-0', '-0')).toBe('-0')
  expect(add(strNumber.NaN, strNumber.NaN)).toBe(strNumber.NaN)
})
