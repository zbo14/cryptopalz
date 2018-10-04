'use strict'

const assert = require('assert')
const crypto = require('crypto')
const fixedXOR = require('../set1/fixed-xor')
const decryptCTR = require('../set3/decrypt-ctr')
const encryptCTR = require('../set3/encrypt-ctr')

const key = crypto.randomBytes(16)

// Is this fixed-nonce ctr?

const recrypt = (ciphertext, offset, newtext) => {
  let plaintext = decryptCTR(ciphertext.slice(offset), key)
  plaintext = Buffer.concat([
    newtext,
    plaintext.slice(newtext.length)
  ])
  return Buffer.concat([
    ciphertext.slice(0, offset),
    encryptCTR(plaintext, key)
  ])
}

module.exports = plaintext => {
  const ciphertext1 = encryptCTR(plaintext, key)
  const newtext = Buffer.from('a'.repeat(ciphertext1.length))
  const ciphertext2 = recrypt(ciphertext1, 0, newtext)
  const result = fixedXOR(fixedXOR(ciphertext1, ciphertext2), newtext)
  assert(result.equals(plaintext))
}
