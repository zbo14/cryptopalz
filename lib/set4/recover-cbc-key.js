'use strict'

const assert = require('assert')
const crypto = require('crypto')
const fixedXOR = require('../set1/fixed-xor')
const encryptCBC = require('../set2/encrypt-cbc')
const decryptCBC = require('../set2/decrypt-cbc')
const pad = require('../set2/pkcs7-padding')
const unpad = require('../set2/unpad')

const key = crypto.randomBytes(16)

const encrypt = buf => {
  buf = pad(buf, 16)
  return encryptCBC(buf, key, key)
}

const decrypt = plaintext => unpad(decryptCBC(plaintext, key, key))

module.exports = plaintext => {
  const plaintext1 = plaintext.slice(0, 48)
  const ciphertext1 = encrypt(plaintext1)
  const ciphertext2 = Buffer.concat([
    ciphertext1.slice(0, 16),
    Buffer.alloc(16),
    ciphertext1.slice(0, 16)
  ])
  const plaintext2 = decrypt(ciphertext2)
  const result = fixedXOR(
    plaintext2.slice(0, 16),
    plaintext2.slice(32, 48)
  )
  assert(result.equals(key))
}
