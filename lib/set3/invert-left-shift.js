'use strict'

const bitsFromNumber = require('./bits-from-number')
const bitsToNumber = require('./bits-to-number')

module.exports = (x, n, and) => {
  const bits1 = bitsFromNumber(x)
  const bits2 = bitsFromNumber(and)
  const result = []
  const diff = bits1.length - bits2.length

  if (diff > 0) {
    bits2.unshift(...'0'.repeat(diff).split('').map(Number))
  } else if (diff < 0) {
    bits1.unshift(...'0'.repeat(-diff).split('').map(Number))
  }

  for (let i = 0; i < bits1.length; i++) {
    if (!bits2[i]) {
      result.push(bits1[i] ? 1 : 0)
    } else {
      result.push(2)
    }
  }

  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i] === 2) {
      if (!result[i + n] || !bits2[i]) {
        result[i] = bits1[i] ? 1 : 0
      } else {
        result[i] = bits1[i] ? 0 : 1
      }
    }
  }

  return bitsToNumber(result)
}
