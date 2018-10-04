'use strict'

const encryptECB = require('./encrypt-ecb')
const getBlocks = require('../set1/get-blocks')
const getUniqueBlocks = require('../set1/get-unique-blocks')

const findBlockLength = (chr, target, key) => {
  let blockLength
  let ciphertext
  let numBlocks
  let numUnique
  let plaintext

  for (blockLength = 1; blockLength <= 128; blockLength++) {
    plaintext = Buffer.concat([
      Buffer.from(chr.repeat(blockLength)),
      target
    ])
    ciphertext = encryptECB(plaintext, key)
    numBlocks = getBlocks(ciphertext).length
    numUnique = getUniqueBlocks(ciphertext).length
    if (numBlocks > numUnique) {
      return blockLength / 2
    }
  }
}

module.exports = (chr, target, key) => {
  const blockLength = findBlockLength(chr, target, key)

  let block
  let ciphertext
  let decrypted = ''
  let mod
  let input
  let plaintext

  const length = target.length

  for (let i = 0; i < length; i++) {
    mod = i % blockLength
    input = chr.repeat(blockLength - 1 - mod)

    if (i && !mod) {
      target = target.slice(blockLength)
    }

    plaintext = Buffer.concat([ Buffer.from(input), target ])
    ciphertext = encryptECB(plaintext, key)
    block = ciphertext.slice(0, blockLength).toString('base64')

    for (let j = 0; j < 256; j++) {
      plaintext = Buffer.from(
        input +
        (mod ? decrypted.slice(-mod) : '') +
        String.fromCharCode(j)
      )
      ciphertext = encryptECB(plaintext, key).toString('base64')
      if (block === ciphertext) {
        decrypted += String.fromCharCode(j)
        break
      }
    }
  }

  return decrypted
}
