'use strict'

/* eslint-env mocha */

const assert = require('assert')
const pkcs7Padding = require('../lib/set2/pkcs7-padding')
const decryptECB = require('../lib/set1/decrypt-ecb')
const encryptECB = require('../lib/set2/encrypt-ecb')
const encryptCBC = require('../lib/set2/encrypt-cbc')
const decryptCBC = require('../lib/set2/decrypt-cbc')
const detectionOracle = require('../lib/set2/detection-oracle')
const byteAtATime = require('../lib/set2/byte-at-a-time')
const byteAtATime2 = require('../lib/set2/byte-at-a-time2')
const cutAndPaste = require('../lib/set2/cut-and-paste')
const getBlocks = require('../lib/set1/get-blocks')
const unpad = require('../lib/set2/unpad')
const cbcBitflipping = require('../lib/set2/cbc-bitflipping')

describe('set2', () => {
  describe('#pkcs7Padding()', () => {
    it('implements pkcs7 padding', () => {
      const buf = Buffer.from('YELLOW SUBMARINE')
      const result = pkcs7Padding(buf, 20)
      assert.deepStrictEqual(
        result,
        Buffer.concat([ buf, Buffer.alloc(4).fill(4) ])
      )
    })
  })

  describe('#encrypt/decryptECB()', () => {
    it('encrypts and decrypts in ecb mode', () => {
      const buf = Buffer.from('1231231231232223')
      const key = Buffer.from('YELLOW SUBMARINE')
      const result = decryptECB(encryptECB(buf, key), key).toString()
      assert.strictEqual(result, '1231231231232223')
    })
  })

  describe('#encrypt/decryptCBC()', () => {
    it('encrypts and decrypts in cbc mode', () => {
      const buf = Buffer.from('12312312312322232')
      const key = Buffer.from('YELLOW SUBMARINE')
      const iv = Buffer.alloc(16)
      const result = decryptCBC(encryptCBC(buf, key, iv), key, iv)
      assert.deepStrictEqual(result, pkcs7Padding(buf, 16))
    })

    it('decrypts a base64 encoded ciphertext in cbc mode', () => {
      const base64 = require('./fixtures/cbc')
      const buf = Buffer.from(base64, 'base64')
      const key = Buffer.from('YELLOW SUBMARINE')
      const iv = Buffer.alloc(16)
      const result = decryptCBC(buf, key, iv).toString()
      console.log(result)
    })
  })

  describe('#oracle', () => {
    it('detects mode of encryption', () => {
      const buf = Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      detectionOracle(buf)
    })
  })

  describe('#byteAtATime()', () => {
    it('decrypts unknown string appended to plaintext before encryption', () => {
      const base64 = require('./fixtures/byte-at-a-time')
      const key = Buffer.from('YELLOW SUBMARINE')
      const target = Buffer.from(base64, 'base64')
      const decrypted = byteAtATime('a', target, key)
      assert.strictEqual(
        decrypted,
        `Rollin' in my 5.0\nWith my rag-top down so my hair can blow\nThe girlies on standby waving just to say hi\nDid you stop? No, I just drove by\n`
      )
    })
  })

  describe('#cutAndPaste()', () => {
    it('finds ciphertext for cookie with role=admin and decrypts it', () => {
      let email = '1231231231233'
      let ciphertext = cutAndPaste.encrypt(email)
      const blocks = []
      blocks.push(...getBlocks(ciphertext).slice(0, 2))

      email = '1234567890' + pkcs7Padding(Buffer.from('admin'), 16).toString()
      ciphertext = cutAndPaste.encrypt(email)
      blocks.push(getBlocks(ciphertext)[1])

      const result = cutAndPaste.decrypt(Buffer.concat(blocks)).toString()
      assert(result.includes('role=admin'))
    })
  })

  describe('#byteAtATime2()', () => {
    it('decrypts unknown string appended to plaintext with random prepended bytes', () => {
      const base64 = require('./fixtures/byte-at-a-time')
      const key = Buffer.from('YELLOW SUBMARINE')
      const target = Buffer.from(base64, 'base64')
      const decrypted = byteAtATime2('a', target, key)
      assert.strictEqual(
        decrypted,
        `Rollin' in my 5.0\nWith my rag-top down so my hair can blow\nThe girlies on standby waving just to say hi\nDid you stop? No, I just drove by\n`
      )
    })
  })

  describe('#unpad()', () => {
    it('unpads buffer with pkcs7-padding', () => {
      assert.strictEqual(
        unpad(Buffer.from('ICE ICE BABY\x04\x04\x04\x04')).toString(),
        'ICE ICE BABY'
      )
      assert.strictEqual(
        unpad(Buffer.from('ICE ICE BABY\x05\x05\x05\x05')).toString(),
        'ICE ICE BABY\x05\x05\x05\x05'
      )
      assert.strictEqual(
        unpad(Buffer.from('ICE ICE BABY\x01\x02\x03\x04')).toString(),
        'ICE ICE BABY\x01\x02\x03\x04'
      )
    })
  })

  describe('#cbcBitflipping()', () => {
    it('should fail', () => {
      try {
        const input = Buffer.from(';admin=true')
        cbcBitflipping(input)
        assert.ok(false, 'should have thrown error')
      } catch (err) {
        assert.strictEqual(err.message, 'bad input')
      }
    })

    it('bitflips a ciphertext until it can decrypt it to admin plaintext', () => {
      const input = Buffer.from('a'.repeat(11))
      const target = Buffer.from(';admin=true')
      const isAdmin = cbcBitflipping(input, target)
      assert(isAdmin)
    })
  })
})
