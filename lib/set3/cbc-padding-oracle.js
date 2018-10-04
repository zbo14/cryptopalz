'use strict'

const crypto = require('crypto')
const getBlocks = require('../set1/get-blocks')
const decryptCBC = require('../set2/decrypt-cbc')
const encryptCBC = require('../set2/encrypt-cbc')
const pad = require('../set2/pkcs7-padding')
const unpad = require('../set2/unpad')

const iv = crypto.randomBytes(16)
const key = crypto.randomBytes(16)

const encrypt = plaintext => encryptCBC(pad(plaintext), key, iv)

const decrypt = ciphertext => {
  const plaintext = decryptCBC(ciphertext, key, iv)
  return plaintext.length !== unpad(plaintext).length
}

module.exports = plaintext => {
  const ciphertext = encrypt(plaintext)
  const blocks = getBlocks(ciphertext)
  const decrypted = []

  let block
  let tmp
  let tmps
  let val
  let validPadding

  for (let i = blocks.length - 1; i >= 0; i--) {
    tmps = []

    for (let j = 0, k = 15; j < 16; j++, k--) {
      block = Buffer.concat([
        Buffer.alloc(16 - tmps.length),
        Buffer.from(tmps.map(tmp => tmp ^ (j + 1)))
      ])

      for (let l = 0; l < 256; l++) {
        block[k] = l

        validPadding = decrypt(Buffer.concat([
          ...blocks.slice(0, Math.max(i - 1, 0)),
          block,
          blocks[i]
        ]))

        if (validPadding) {
          tmp = l ^ (j + 1)
          tmps.unshift(tmp)
          val = tmp ^ (i ? blocks[i - 1][k] : iv[k])
          decrypted.unshift(val)
          break
        }
      }
    }
  }

  return unpad(Buffer.from(decrypted))
}
