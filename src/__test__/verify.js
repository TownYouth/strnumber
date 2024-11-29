/* eslint-disable no-unused-vars */
const https = require('https')
const { exec } = require('child_process')
const iconv = require('iconv-lite')

function setClib(str) {
  exec('clip').stdin.end(iconv.encode(str, 'gbk'))
}

function calc(a, b, type) {
  return new Promise((resolve) => {
    https.get(
      `https://www.calculator.net/big-number-calculator.html?cp=100&cx=${a}&cy=${b}&co=${type}`,
      (res) => {
        let json = Buffer.from('')
        res.on('data', (data) => {
          json = Buffer.concat([json, data])
        })
        res.on('end', () => {
          const result = json
            .toString()
            .match(/<p class="bigtext".*>(.*?)<\/p>/)?.[1]
            ?.replace(/,/g, '')
          resolve(result)
        })
      }
    )
  })
}

function add(a, b) {
  return calc(a, b, 'plus')
}
function minus(a, b) {
  return calc(a, b, 'minus')
}
function times(a, b) {
  return calc(a, b, 'multiple')
}
function into(a, b) {
  return calc(a, b, 'divide')
}

const CalcMap = {
  add,
  minus,
  times,
  into
}

function start(str) {
  const strList = str.replace(/ /g, '').split('\n').filter(Boolean)

  Promise.all(
    strList.map((item, index) => {
      const method = CalcMap[item.match(/(?<=expect\()\w+(?=\()/)[0]]
      if (!method) throw new Error('not found method')
      const a = item.match(/(?<=\(').+(?=',)/)[0]
      if (!a) throw new Error('not found a')
      const b = item.match(/(?<=,').+(?='\)\))/)[0]
      if (!b) throw new Error('not found b')

      return method(a, b).then((res) => {
        strList[index] = strList[index].replace('toBe()', `toBe('${res}')`)
      })
    })
  ).then(() => {
    setClib(strList.join('\n'))
  })
}

// start(`
//   expect(times('1234567890123456789', '20')).toBe()
//   expect(times('-1234567890123456789', '20')).toBe()
//   expect(times('-1234567890123456789', '-20')).toBe()
//   expect(times('1234567890123456789', '-20')).toBe()
//   expect(times('1234567890123456789', '1234567890123456788')).toBe()
//   expect(times('-1234567890123456789', '1234567890123456788')).toBe()
//   expect(times('-1234567890123456789', '-1234567890123456788')).toBe()
//   expect(times('1234567890123456789', '-1234567890123456788')).toBe()
//   `)

// start(`
//     expect(times('1234567890123456789.132456489132456489132456489132456489', '20')).toBe()
//     expect(times('-1234567890123456789.132456489132456489132456489132456489', '20')).toBe()
//     expect(times('-1234567890123456789.132456489132456489132456489132456489', '-20')).toBe()
//     expect(times('1234567890123456789.132456489132456489132456489132456489', '-20')).toBe()
//     expect(times('1234567890123456789.132456489132456489132456489132456489','1234567890123456789.132456489132456489132456489132456488')).toBe()
//     expect(times('-1234567890123456789.132456489132456489132456489132456489','1234567890123456789.132456489132456489132456489132456488')).toBe()
//     expect(times('-1234567890123456789.132456489132456489132456489132456489','-1234567890123456789.132456489132456489132456489132456488')).toBe()
//     expect(times('1234567890123456789.132456489132456489132456489132456489','-1234567890123456789.132456489132456489132456489132456488')).toBe()
//     `)

// node .\src\__test__\verify.js
