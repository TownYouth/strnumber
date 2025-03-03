import { expect, test } from 'vitest'
import { StrNumber } from '../strnumber'

test('不同的传参方式', () => {
  expect(new StrNumber('000123.4500').toString()).toBe('123.45')
  expect(new StrNumber('-0.000').toString()).toBe('-0')
  expect(new StrNumber('-0.123').toString()).toBe('-0.123')
  expect(new StrNumber(Number.NaN).toString()).toBe('NaN')
  expect(new StrNumber(Number.POSITIVE_INFINITY).toString()).toBe('Infinity')
  expect(new StrNumber(Number.NEGATIVE_INFINITY).toString()).toBe('-Infinity')
  expect(new StrNumber(0).toString()).toBe('0')
  expect(new StrNumber('12a3').toString()).toBe('12') // 含非法字符
  expect(new StrNumber('12.34.56').toString()).toBe('12.34') // 多个小数点
  expect(new StrNumber('-').toString()).toBe('NaN')
})
