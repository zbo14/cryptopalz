'use strict'

/* eslint-env mocha */

const assert = require('assert')
const crypto = require('crypto')
const decryptECB = require('../lib/set1/decrypt-ecb')
const breakRandomAccess = require('../lib/set4/break-random-access')
const ctrBitflipping = require('../lib/set4/ctr-bitflipping')
const recoverCBCKey = require('../lib/set4/recover-cbc-key')
const mdPad = require('../lib/set4/md-pad')
const sha1 = require('../lib/set4/sha1')
const sha1MAC = require('../lib/set4/sha1-mac')
const sha1LengthExtension = require('../lib/set4/sha1-length-extension')

describe('set4', () => {
  describe('#breakRandomAccess()', () => {
    it('finds plaintext', () => {
      const base64 = require('./fixtures/break-random-access')
      const key = Buffer.from('YELLOW SUBMARINE')
      const plaintext = decryptECB(Buffer.from(base64, 'base64'), key)
      breakRandomAccess(plaintext)
    })
  })

  describe('#ctrBitflipping()', () => {
    it('does ctr bitflipping', () => {
      const input = Buffer.from('a'.repeat(11))
      const target = Buffer.from(';admin=true;')
      assert(ctrBitflipping(input, target))
    })
  })

  describe('#recoverCBCKey()', () => {
    it('finds key used in cbc encryption', () => {
      const plaintext = crypto.randomBytes(48)
      recoverCBCKey(plaintext)
    })
  })

  describe('#mdPad()', () => {
    it('does md padding', () => {
      const padded = mdPad(Buffer.from('abc'))
      assert.strictEqual(padded.length, 64)
    })
  })

  describe('#sha1()', () => {
    it('performs sha1 hash', () => {
      const msg = Buffer.from('abc')
      const result = sha1(msg)
      const hash = crypto.createHash('sha1')
      hash.update(msg)
      assert.deepStrictEqual(result, hash.digest())
    })
  })

  describe('#sha1MAC()', () => {
    it('validates', () => {
      const msg = Buffer.from('foobar')
      const hash = sha1MAC.digest(msg)
      assert(sha1MAC.auth(msg, hash))
    })

    it('tampers and invalidates', () => {
      const msg = Buffer.from('foobar')
      const digest = sha1MAC.digest(msg)
      digest[0]++
      assert(!sha1MAC.auth(msg, digest))
    })
  })

  describe('#sha1-length-extension', () => {
    it('forges digest for message using sha1 length extension attack', () => {
      const msg = Buffer.from('comment1=cooking')
      const extra = Buffer.from(';admin=true')
      sha1LengthExtension(msg, extra)
    })
  })
})
