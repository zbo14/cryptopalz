'use strict'

const assert = require('assert')
const invertRightShift = require('./invert-right-shift')
const invertLeftShift = require('./invert-left-shift')
const MT = require('./mersenne-twister')

const untemper = x => {
  x = invertRightShift(x, 18)
  x = invertLeftShift(x, 15, 0xEFC60000)
  x = invertLeftShift(x, 7, 0x9D2C5680)
  x = invertRightShift(x, 11)
  return x
}

module.exports = () => {
  const mt1 = new MT()
  const mt2 = new MT()
  const seed = Math.round(Math.random() * 0xFFFFFFFF)
  mt1.seed(seed)
  const vals = mt1.generate(624)
  mt2.idx = 0
  mt2.mt = vals.map(untemper)
  const results = mt2.generate(624)
  assert.deepStrictEqual(results, vals)
}
