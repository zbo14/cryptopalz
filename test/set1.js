'use strict'

/* eslint-env mocha */

const assert = require('assert')
const hammingDistance = require('../lib/set1/hamming-distance')
const hex2base64 = require('../lib/set1/hex2base64')
const fixedXOR = require('../lib/set1/fixed-xor')
const singleByteXOR = require('../lib/set1/single-byte-xor')
// const detectSingleCharXOR = require('../lib/set1/detect-single-char-xor')
const repeatingKeyXOR = require('../lib/set1/repeating-key-xor')
const breakRepeatingKeyXOR = require('../lib/set1/break-repeating-key-xor')
const decryptECB = require('../lib/set1/decrypt-ecb')
const detectECB = require('../lib/set1/detect-ecb')

describe('set1', () => {
  describe('#hex2base64()', () => {
    it('converts hex string to base64', () => {
      const hex = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d'
      const base64 = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t'
      const result = hex2base64(hex)
      assert.strictEqual(result, base64)
    })
  })

  describe('#fixedXOR()', () => {
    it('takes two equal-length buffers and produces their XOR combination', () => {
      const buf1 = Buffer.from('1c0111001f010100061a024b53535009181c', 'hex')
      const buf2 = Buffer.from('686974207468652062756c6c277320657965', 'hex')
      const hex = '746865206b696420646f6e277420706c6179'
      const result = fixedXOR(buf1, buf2).toString('hex')
      assert.strictEqual(result, hex)
    })
  })

  describe('#singleByteXOR()', () => {
    it('finds single character that string was xor\'d against', () => {
      const buf = Buffer.from('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', 'hex')
      const result = singleByteXOR(buf)
      assert.deepStrictEqual(result, {
        charCode: 88,
        message: 'Cooking MC\'s like a pound of bacon',
        score: 2.1713
      })
    })
  })

  // describe('#detectSingleCharXOR()', () => {
  //   it('finds string that was encrypted by single character xor', () => {
  //     const text = require('./fixtures/detect-single-char-xor')
  //     const buf = Buffer.from(text)
  //     const result = detectSingleCharXOR(buf)
  //     assert(result instanceof Array)
  //     assert.strictEqual(result.length, 5)
  //     assert.deepStrictEqual(result[0], {
  //       charCode: 53,
  //       message: 'Now that the party is jumping\n',
  //       score: 2.0057,
  //       string: '7b5a4215415d544115415d5015455447414c155c46155f4058455c5b523f',
  //       index: 170
  //     })
  //   })
  // })

  describe('#repeatingKeyXOR()', () => {
    it('encrypts a plaintext with a repeating key XOR', () => {
      const text = require('./fixtures/repeating-key-xor')
      const buf = Buffer.from(text)
      const hex = '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f'
      const key = Buffer.from('ICE')
      const result = repeatingKeyXOR(buf, key)
      assert.strictEqual(result.toString('hex'), hex)
    })
  })

  describe('#hammingDistance()', () => {
    it('calculates hamming distance between two strings', () => {
      const buf1 = Buffer.from('this is a test')
      const buf2 = Buffer.from('wokka wokka!!!')
      const result = hammingDistance(buf1, buf2)
      assert.strictEqual(result, 37)
    })
  })

  describe('#breakRepeatingKeyXOR()', () => {
    it('decrypt text that\'s been encrypted with repeating-key xor', () => {
      const base64 = require('./fixtures/break-repeating-key-xor')
      const buf = Buffer.from(base64, 'base64')
      const results = breakRepeatingKeyXOR(buf).toString()
      console.log(results)
    }).timeout(5000)
  })

  describe('#decryptECB()', () => {
    it('decrypt the base64-encoded ciphertext with aes-128-ecb', () => {
      const base64 = require('./fixtures/decrypt-ecb')
      const buf = Buffer.from(base64, 'base64')
      const key = Buffer.from('YELLOW SUBMARINE')
      const result = decryptECB(buf, key).toString()
      console.log(result)
    })
  })

  describe('#detectECB', () => {
    it('detects string that has been encrypted with aes-ecb', () => {
      const base64 = require('./fixtures/detect-ecb')
      const bufs = base64.split('\n').map(base64 => Buffer.from(base64, 'base64'))
      const result = detectECB(bufs).toString('base64')
      console.log(result)
    })
  })
})
