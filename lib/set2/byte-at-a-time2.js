'use strict'

const crypto = require('crypto')
const encryptECB = require('./encrypt-ecb')
const getBlocks = require('../set1/get-blocks')
const getUniqueBlocks = require('../set1/get-unique-blocks')

const prefix = crypto.randomBytes(Math.round(Math.random() * 100))

const findLength = (chr, target, key) => {
  let ciphertext
  let numBlocks
  let numUnique
  let plaintext

  for (let length = 0; length <= 48; length++) {
    plaintext = Buffer.concat([
      prefix,
      Buffer.from(chr.repeat(length)),
      target
    ])
    ciphertext = encryptECB(plaintext, key)
    numBlocks = getBlocks(ciphertext).length
    numUnique = getUniqueBlocks(ciphertext).length
    if (numBlocks > numUnique) {
      return length
    }
  }
}

module.exports = (chr, target, key) => {
  let block
  let ciphertext
  let decrypted = ''
  let mod
  let input
  let plaintext

  const length = findLength(chr, target, key)
  const targetLength = target.length

  for (let i = 0; i < targetLength; i++) {
    mod = i % 16
    input = Buffer.concat([
      prefix,
      Buffer.from(chr.repeat(length - mod - 1))
    ])

    if (i && !mod) {
      target = target.slice(16)
    }

    plaintext = Buffer.concat([ input, target.slice(0, 16) ])
    ciphertext = encryptECB(plaintext, key)
    block = ciphertext.slice(-16).toString('base64')

    for (let j = 0; j < 256; j++) {
      plaintext = Buffer.concat([
        Buffer.from(chr.repeat(15 - mod)),
        Buffer.from(mod ? decrypted.slice(-mod) : ''),
        Buffer.from([ j ])
      ])
      ciphertext = encryptECB(plaintext, key).toString('base64')
      if (block === ciphertext) {
        decrypted += String.fromCharCode(j)
        break
      }
    }
  }

  return decrypted
}
