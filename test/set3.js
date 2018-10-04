'use strict'

/* eslint-env mocha */

const assert = require('assert')
const cbcPaddingOracle = require('../lib/set3/cbc-padding-oracle')
const decryptCTR = require('../lib/set3/decrypt-ctr')
const encryptCTR = require('../lib/set3/encrypt-ctr')
const breakFixedNonceCTR = require('../lib/set3/break-fixed-nonce-ctr')
const breakFixedNonceCTR2 = require('../lib/set3/break-fixed-nonce-ctr2')
const MT = require('../lib/set3/mersenne-twister')
const crackMersenneTwister = require('../lib/set3/crack-mersenne-twister')
const invertRightShift = require('../lib/set3/invert-right-shift')
const invertLeftShift = require('../lib/set3/invert-left-shift')
const cloneMersenneTwister = require('../lib/set3/clone-mersenne-twister')
const breakMTCipher = require('../lib/set3/break-mt-cipher')
const uint32 = require('../lib/set3/uint32')

describe('set3', () => {
  describe('#cbcPaddingOracle()', () => {
    it('bleh', () => {
      const strings = require('./fixtures/cbc-padding-oracle')
      const plaintext = Buffer.from(
        strings[Math.round(Math.random() * strings.length)],
        'base64'
      )
      const result = cbcPaddingOracle(plaintext).toString()
      assert.strictEqual(result, plaintext.toString())
    })
  })

  describe('#decryptCTR()', () => {
    it('decrypts in ctr mode', () => {
      const base64 = require('./fixtures/decrypt-ctr')
      const ciphertext = Buffer.from(base64, 'base64')
      const key = Buffer.from('YELLOW SUBMARINE')
      const result = decryptCTR(ciphertext, key).toString()
      assert.strictEqual(
        result, 'Yo, VIP Let\'s kick it Ice, Ice, baby Ice, Ice, baby '
      )
    })
  })

  describe('#encryptCTR()', () => {
    it('encrypts in ctr mode', () => {
      const base64 = require('./fixtures/decrypt-ctr')
      const plaintext = Buffer.from(
        'Yo, VIP Let\'s kick it Ice, Ice, baby Ice, Ice, baby '
      )
      const key = Buffer.from('YELLOW SUBMARINE')
      const result = encryptCTR(plaintext, key).toString('base64')
      assert.strictEqual(result, base64)
    })
  })

  describe('#breakFixedNonceCTR()', () => {
    it('bleh', () => {
      const base64s = require('./fixtures/break-fixed-nonce-ctr')
      const plaintexts = base64s.map(base64 => Buffer.from(base64, 'base64'))
      console.log(breakFixedNonceCTR(plaintexts))
    })
  })

  describe('#breakFixedNonceCTR2()', () => {
    it('blah', () => {
      const base64s = require('./fixtures/break-fixed-nonce-ctr2')
      const plaintexts = base64s.map(base64 => Buffer.from(base64, 'base64'))
      const result = breakFixedNonceCTR2(plaintexts)
      console.log(result.toString())
    })
  })

  describe('#mersenneTwister()', () => {
    it('yawp', () => {
      const mt = new MT()
      mt.seed(1131464071)
      const result = mt.generate(100)
      assert(result instanceof Array)
      assert.strictEqual(result.length, 100)
      assert(result.every(Number.isInteger))
    })
  })

  describe('#crackMersenneTwister()', () => {
    it('brute force cracks the mersenne twister', async () => {
      await crackMersenneTwister()
    })
  })

  describe('#invertRightShift()', () => {
    it('inverts a right_shift-XOR', () => {
      let x, y
      x = y = Math.round(Math.random() * 0xFFFFFFFF)
      y = uint32(y ^ (y >>> 11))
      assert.strictEqual(invertRightShift(y, 11), x)
    })
  })

  describe('#invertLeftShift()', () => {
    it('inverts a left_shift-AND-XOR', () => {
      let x, y
      x = y = Math.round(Math.random() * 0xFFFFFFFF)
      const and = Math.round(Math.random() * 0xFFFFFF)
      y = uint32(y ^ uint32(and & uint32(y << 7)))
      assert.strictEqual(invertLeftShift(y, 7, and), x)
    })
  })

  describe('#cloneMersenneTwister()', () => {
    it('clones an mt from the values generated from another mt', () => {
      cloneMersenneTwister()
    })
  })

  describe('#breakMTCipher()', () => {
    it('encrypts and decrypts', () => {
      const plaintext = Buffer.from('foobarfoobarfoobarfoobar')
      const { ciphertext, seed } = breakMTCipher.encrypt(plaintext)
      const result = breakMTCipher.decrypt(ciphertext, seed).toString()
      assert.strictEqual(result, plaintext.toString())
    })

    it('brute force finds seed from ciphertext', () => {
      breakMTCipher.recoverSeed()
    }).timeout(5000)
  })
})
