'use strict'

const crypto = require('crypto')
const encryptCBC = require('./encrypt-cbc')
const decryptCBC = require('./decrypt-cbc')
const pad = require('./pkcs7-padding')
const unpad = require('./unpad')

const iv = Buffer.alloc(16)
const key = crypto.randomBytes(16)
const prefix = Buffer.from('comment1=cooking%20MCs;userdata=')
const suffix = Buffer.from(';comment2=%20like%20a%20pound%20of%20bacon')

const encrypt = buf => {
  if (/[;=]/g.test(buf.toString())) {
    throw new Error('bad input')
  }
  buf = pad(Buffer.concat([ prefix, buf, suffix ]), 16)
  return encryptCBC(buf, key, iv)
}

const decrypt = buf => unpad(decryptCBC(buf, key, iv))

module.exports = (buf, target) => {
  const ciphertext = encrypt(buf)
  let result
  let val

  for (let idx = 16; idx < 32; idx++) {
    val = ciphertext[idx]
    while (val !== ++ciphertext[idx]) {
      result = decrypt(ciphertext)
      if (result[idx + 16] === target[idx - 16]) {
        break
      }
    }
  }

  const tuples = decrypt(ciphertext)
    .toString()
    .split(';')
    .map(each => each.split('='))
    .reduce((acc, [key, val]) => {
      acc[key] = val
      return acc
    }, {})

  return !!tuples.admin
}
