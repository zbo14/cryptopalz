'use strict'

const crypto = require('crypto')
const encryptCTR = require('./encrypt-ctr')
const breakRepeatingKeyXOR = require('../set1/break-repeating-key-xor')

module.exports = plaintexts => {
  const key = crypto.randomBytes(16)
  const ciphertexts = plaintexts.map(plaintext => encryptCTR(plaintext, key))
  const length = Math.min(...ciphertexts.map(({ length }) => length))
  const buf = ciphertexts.reduce((acc, ciphertext) => {
    return Buffer.concat([ acc, ciphertext.slice(0, length) ])
  }, Buffer.alloc(0))
  return breakRepeatingKeyXOR(buf, length)
}
