'use strict'

const assert = require('assert')
const MT = require('./mersenne-twister')

const wait = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now())
    }, Math.round(Math.random() * 1000))
  })
}

module.exports = async () => {
  const seed = await wait()
  const mt = new MT()
  mt.seed(seed)
  let y = mt.generate()
  await wait()

  const now = Date.now()

  for (let i = now - 3000; i < now; i++) {
    mt.seed(i)
    if (y === mt.generate()) {
      assert.strictEqual(seed, i)
      return
    }
  }

  throw new Error('Failed to find seed')
}
