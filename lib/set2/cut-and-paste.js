'use strict'

const crypto = require('crypto')
const encryptECB = require('./encrypt-ecb')
const decryptECB = require('../set1/decrypt-ecb')
const pkcs7Padding = require('./pkcs7-padding')
const unpad = require('./unpad')

const key = crypto.randomBytes(16)

exports.encrypt = email => {
  if (/[&=]/.test(email)) {
    throw new Error('Invalid email')
  }
  const str = `email=${email}&uid=10&role=user`
  const plaintext = pkcs7Padding(Buffer.from(str), key.length)
  return encryptECB(plaintext, key)
}

exports.decrypt = ciphertext => {
  return unpad(decryptECB(ciphertext, key))
}
