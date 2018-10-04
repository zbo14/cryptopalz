'use strict'

const assert = require('assert')
const crypto = require('crypto')
const MT = require('./mersenne-twister')
const fixedXOR = require('../set1/fixed-xor')

const mt = new MT()

const newSeed = () => crypto.randomBytes(2).readUInt16LE()

exports.encrypt = (plaintext, seed = newSeed()) => {
  const length = Math.ceil(plaintext.length / 4) * 4
  let keystream = Buffer.alloc(length)
  mt.seed(seed)
  const nums = mt.generate(length / 4)
  for (let i = 0; i < nums.length; i++) {
    keystream.writeUInt32LE(nums[i], i * 4)
  }
  keystream = keystream.slice(0, plaintext.length)
  const ciphertext = fixedXOR(plaintext, keystream)
  return { ciphertext, seed }
}

exports.decrypt = (ciphertext, seed = newSeed()) => {
  const length = Math.ceil(ciphertext.length / 4) * 4
  let keystream = Buffer.alloc(length)
  mt.seed(seed)
  const nums = mt.generate(length / 4)
  let i
  for (i = 0; i < nums.length; i++) {
    keystream.writeUInt32LE(nums[i], i * 4)
  }
  keystream = keystream.slice(0, ciphertext.length)
  return fixedXOR(ciphertext, keystream)
}

exports.recoverSeed = () => {
  let plaintext = Buffer.concat([
    crypto.randomBytes(Math.round(Math.random() * 100)),
    Buffer.from('a'.repeat(14))
  ])
  let { ciphertext, seed } = exports.encrypt(plaintext)
  const prefixLength = plaintext.length - 14
  ciphertext = ciphertext.slice(0, prefixLength)
  plaintext = plaintext.slice(0, prefixLength)
  let result
  for (let i = 0; i < 65536; i++) {
    result = exports.encrypt(plaintext, i)
    try {
      assert(result.ciphertext.equals(ciphertext))
    } catch (_) {
      continue
    }
    assert.strictEqual(i, seed)
    console.log(`Seed is ${seed}!`)
    return
  }
  throw new Error('')
}
