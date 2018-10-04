'use strict'

const bitsFromNumber = require('./bits-from-number')
const bitsToNumber = require('./bits-to-number')

module.exports = (x, n) => {
  const bits = bitsFromNumber(x)
  for (let i = n; i < bits.length; i++) {
    bits[i] ^= bits[i - n]
  }
  return bitsToNumber(bits)
}
