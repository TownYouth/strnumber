import { expect, test } from 'vitest'
import { strNumber, StrNumber } from '../strnumber'

const { into } = strNumber

test('不同的调用方式', () => {
  expect(strNumber.into === StrNumber.into).toBe(true)
})

test('不同的传参方式', () => {
  expect(into(1, 2)).toBe('0.5')
  expect(into('1', 2)).toBe('0.5')
  expect(into(1, '2')).toBe('0.5')
  expect(into(strNumber(1), '2')).toBe('0.5')
  expect(into(1, new StrNumber('2'))).toBe('0.5')
})

test('小整数相除', () => {
  expect(into(1, 2)).toBe('0.5')
  expect(into(100000, 20)).toBe('5000')
  expect(into(-100000, 20)).toBe('-5000')
  expect(into(-100000, -20)).toBe('5000')
  expect(into(100000, -20)).toBe('-5000')
})

test('大整数相除', () => {
  expect(into('1234567890123456789', '20')).toBe('61728394506172839.45')
  expect(into('-1234567890123456789', '20')).toBe('-61728394506172839.45')
  expect(into('-1234567890123456789', '-20')).toBe('61728394506172839.45')
  expect(into('1234567890123456789', '-20')).toBe('-61728394506172839.45')
  expect(into('1234567890123456789', '1234567890123456788')).toBe(
    '1.0000000000000000008100000072900000670032006155676056553539559569618853398657723047663935274666701113'
  )
  expect(into('-1234567890123456789', '1234567890123456788')).toBe(
    '-1.0000000000000000008100000072900000670032006155676056553539559569618853398657723047663935274666701113'
  )
  expect(into('-1234567890123456789', '-1234567890123456788')).toBe(
    '1.0000000000000000008100000072900000670032006155676056553539559569618853398657723047663935274666701113'
  )
  expect(into('1234567890123456789', '-1234567890123456788')).toBe(
    '-1.0000000000000000008100000072900000670032006155676056553539559569618853398657723047663935274666701113'
  )
})

test('小数相除', () => {
  expect(into('1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '61728394506172839.45662282445662282445662282445662282445'
  )
  expect(into('-1234567890123456789.132456489132456489132456489132456489', '20')).toBe(
    '-61728394506172839.45662282445662282445662282445662282445'
  )
  expect(into('-1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '61728394506172839.45662282445662282445662282445662282445'
  )
  expect(into('1234567890123456789.132456489132456489132456489132456489', '-20')).toBe(
    '-61728394506172839.45662282445662282445662282445662282445'
  )
  expect(
    into(
      '1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '1.0000000000000000000000000000000000000000000000000000008100000072900000662601958996737161250531361053'
  )
  expect(
    into(
      '-1234567890123456789.132456489132456489132456489132456489',
      '1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '-1.0000000000000000000000000000000000000000000000000000008100000072900000662601958996737161250531361053'
  )
  expect(
    into(
      '-1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '1.0000000000000000000000000000000000000000000000000000008100000072900000662601958996737161250531361053'
  )
  expect(
    into(
      '1234567890123456789.132456489132456489132456489132456489',
      '-1234567890123456789.132456489132456489132456489132456488'
    )
  ).toBe(
    '-1.0000000000000000000000000000000000000000000000000000008100000072900000662601958996737161250531361053'
  )
})

test('特殊数字相除', () => {
  expect(into(Infinity, -Infinity)).toBe(strNumber.NaN)
  expect(into(Infinity, 0)).toBe(strNumber.POSITIVE_INFINITY)
  expect(into(Infinity, -0)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(into(Infinity, NaN)).toBe(strNumber.NaN)
  expect(into(-Infinity, 0)).toBe(strNumber.NEGATIVE_INFINITY)
  expect(into(-Infinity, -0)).toBe(strNumber.POSITIVE_INFINITY)
  expect(into(-Infinity, NaN)).toBe(strNumber.NaN)
  expect(into(0, -0)).toBe(strNumber.NaN)
  expect(into(0, NaN)).toBe(strNumber.NaN)
  expect(into(-0, NaN)).toBe(strNumber.NaN)
  expect(into(-Infinity, Infinity)).toBe(strNumber.NaN)
  expect(into(0, Infinity)).toBe('0')
  expect(into(-0, Infinity)).toBe('-0')
  expect(into(NaN, Infinity)).toBe(strNumber.NaN)
  expect(into(0, -Infinity)).toBe('-0')
  expect(into(-0, -Infinity)).toBe('0')
  expect(into(NaN, -Infinity)).toBe(strNumber.NaN)
  expect(into(-0, 0)).toBe(strNumber.NaN)
  expect(into(NaN, 0)).toBe(strNumber.NaN)
  expect(into(NaN, -0)).toBe(strNumber.NaN)
  expect(into(Infinity, Infinity)).toBe(strNumber.NaN)
  expect(into(-Infinity, -Infinity)).toBe(strNumber.NaN)
  expect(into(0, 0)).toBe(strNumber.NaN)
  expect(into(-0, -0)).toBe(strNumber.NaN)
  expect(into(NaN, NaN)).toBe(strNumber.NaN)

  expect(into(strNumber.POSITIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(into(strNumber.POSITIVE_INFINITY, '0')).toBe(strNumber.POSITIVE_INFINITY)
  expect(into(strNumber.POSITIVE_INFINITY, '-0')).toBe(strNumber.NEGATIVE_INFINITY)
  expect(into(strNumber.POSITIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(into(strNumber.NEGATIVE_INFINITY, '0')).toBe(strNumber.NEGATIVE_INFINITY)
  expect(into(strNumber.NEGATIVE_INFINITY, '-0')).toBe(strNumber.POSITIVE_INFINITY)
  expect(into(strNumber.NEGATIVE_INFINITY, strNumber.NaN)).toBe(strNumber.NaN)
  expect(into('0', '-0')).toBe(strNumber.NaN)
  expect(into('0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(into('-0', strNumber.NaN)).toBe(strNumber.NaN)
  expect(into(strNumber.NEGATIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(into('0', strNumber.POSITIVE_INFINITY)).toBe('0')
  expect(into('-0', strNumber.POSITIVE_INFINITY)).toBe('-0')
  expect(into(strNumber.NaN, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(into('0', strNumber.NEGATIVE_INFINITY)).toBe('-0')
  expect(into('-0', strNumber.NEGATIVE_INFINITY)).toBe('0')
  expect(into(strNumber.NaN, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(into('-0', '0')).toBe(strNumber.NaN)
  expect(into(strNumber.NaN, '0')).toBe(strNumber.NaN)
  expect(into(strNumber.NaN, '-0')).toBe(strNumber.NaN)
  expect(into(strNumber.POSITIVE_INFINITY, strNumber.POSITIVE_INFINITY)).toBe(strNumber.NaN)
  expect(into(strNumber.NEGATIVE_INFINITY, strNumber.NEGATIVE_INFINITY)).toBe(strNumber.NaN)
  expect(into('0', '0')).toBe(strNumber.NaN)
  expect(into('-0', '-0')).toBe(strNumber.NaN)
  expect(into(strNumber.NaN, strNumber.NaN)).toBe(strNumber.NaN)
})
