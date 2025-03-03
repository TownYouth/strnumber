import { expect, test } from 'vitest'
import { strNumber } from '../strnumber'

const { calc } = strNumber

test('常规场景', () => {
  expect(calc('(100 + 200) * 3 - 50 / 2')).toBe('875')
})
