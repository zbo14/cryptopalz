'use strict'

const crypto = require('crypto')
const encryptCTR = require('./encrypt-ctr')
const fixedXOR = require('../set1/repeating-key-xor')
const scorePlaintext = require('../set1/score-plaintext')

module.exports = plaintexts => {
  const key = crypto.randomBytes(16)
  const ciphertexts = plaintexts.map(plaintext => encryptCTR(plaintext, key))
  const length = Math.max(...ciphertexts.map(({ length }) => length))
  const keybytes = []

  let keybyte
  let score
  let topScore
  let plaintext

  for (let i = 0; i < length; i++) {
    keybyte = 0
    topScore = 0
    for (let j = 0; j < 256; j++) {
      plaintext = ''
      ciphertexts.forEach(ciphertext => {
        if (ciphertext.length > i) {
          plaintext += String.fromCharCode(ciphertext[i] ^ j)
        }
      })
      score = scorePlaintext(plaintext) / plaintext.length
      if (score > topScore) {
        topScore = score
        keybyte = j
      }
    }
    keybytes.push(keybyte)
  }

  return ciphertexts.map(ciphertext => {
    return fixedXOR(
      ciphertext,
      keybytes.slice(0, ciphertext.length)
    ).toString()
  })
}
