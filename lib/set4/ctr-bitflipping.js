'use strict'

const crypto = require('crypto')
const encryptCTR = require('../set3/encrypt-ctr')
const decryptCTR = require('../set3/decrypt-ctr')

const iv = Buffer.alloc(16)
const key = crypto.randomBytes(16)
const prefix = Buffer.from('comment1=cooking%20MCs;userdata=')
const suffix = Buffer.from(';comment2=%20like%20a%20pound%20of%20bacon')

const encrypt = buf => {
  if (/[;=]/g.test(buf.toString())) {
    throw new Error('bad input')
  }
  buf = Buffer.concat([ prefix, buf, suffix ])
  return encryptCTR(buf, key, iv)
}

const decrypt = buf => decryptCTR(buf, key, iv)

module.exports = (buf, target) => {
  const ciphertext = encrypt(buf)
  let result
  let val

  for (let i = 0; i < ciphertext.length; i++) {
    val = ciphertext[i]
    while (val !== ++ciphertext[i]) {
      result = decrypt(ciphertext)
      if (result[i] === target[i]) {
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
