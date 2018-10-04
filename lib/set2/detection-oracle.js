'use strict'

const assert = require('assert')
const getBlocks = require('../set1/get-blocks')
const getUniqueBlocks = require('../set1/get-unique-blocks')
const crypto = require('crypto')
const encryptECB = require('./encrypt-ecb')
const encryptCBC = require('./encrypt-cbc')
const pkcs7Padding = require('./pkcs7-padding')

const encrypt = buf => {
  const key = crypto.randomBytes(16)
  const mode = Math.round(Math.random())
  const padLength = Math.round(Math.random() * 5 + 5)
  const before = crypto.randomBytes(padLength)
  const after = crypto.randomBytes(padLength)

  buf = Buffer.concat([ before, buf, after ])

  if (mode) {
    buf = pkcs7Padding(buf, 16)
    return {
      mode: 'ecb',
      ciphertext: encryptECB(buf, key)
    }
  } else {
    const iv = crypto.randomBytes(16)

    return {
      mode: 'cbc',
      ciphertext: encryptCBC(buf, key, iv)
    }
  }
}

module.exports = buf => {
  const { mode, ciphertext } = encrypt(buf)
  const numBlocks = getBlocks(ciphertext, 16).length
  const numUnique = getUniqueBlocks(ciphertext, 16).length
  if (numUnique === numBlocks) {
    assert.strictEqual(mode, 'cbc')
  } else {
    assert.strictEqual(mode, 'ecb')
  }
}
