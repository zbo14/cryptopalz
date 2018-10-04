'use strict'

const fixedXOR = require('./fixed-xor')
const scorePlaintext = require('./score-plaintext')

/**
 * singleByteXOR
 *
 * @param  {Buffer} buf
 * @return {Object}
 */
module.exports = buf => {
  const key = Buffer.alloc(buf.length)
  const results = []
  let plaintext
  let score

  for (let i = 0; i < 256; i++) {
    key.fill(i)
    plaintext = fixedXOR(buf, key).toString()

    score = scorePlaintext(plaintext)

    results[i] = {
      charCode: i,
      message: plaintext,
      score: Math.round(score * 1e4) / 1e4
    }
  }

  results.sort((a, b) => {
    if (a.score > b.score) {
      return -1
    }

    if (a.score < b.score) {
      return 1
    }

    return 0
  })

  return results[0]
}
