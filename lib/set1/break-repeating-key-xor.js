'use strict'

const hammingDistance = require('./hamming-distance')
const repeatingKeyXOR = require('./repeating-key-xor')
const singleByteXOR = require('./single-byte-xor')

const topKeysize = buf => {
  const results = []
  let distance
  let i
  let j

  for (i = 2; i < 40; i++) {
    distance = 0
    for (j = 0; i * (j + 2) <= buf.length; j++) {
      distance += hammingDistance(
        buf.slice(i * j, i * (j + 1)),
        buf.slice(i * (j + 1), i * (j + 2))
      )
    }
    distance /= (i * (j + 1))
    results.push({
      keysize: i,
      distance
    })
  }
  results.sort((a, b) => {
    if (a.distance < b.distance) {
      return -1
    }

    if (a.distance > b.distance) {
      return 1
    }

    return 0
  })

  return results[0].keysize
}

const transpose = (buf, keysize) => {
  const blocks = []

  for (let i = 0; i < keysize; i++) {
    const block = []

    for (let j = i; j < buf.length; j += keysize) {
      block.push(buf[j])
    }

    blocks.push(Buffer.from(block))
  }

  return blocks
}

const solveBlocks = blocks => {
  return Buffer.from(
    blocks.map(block => singleByteXOR(block).charCode)
  )
}

/**
 * breakRepeatingKeyXOR
 *
 * @param  {Buffer} buf
 * @param  {Number} [keysize]
 *
 * @return {Buffer}
 */
module.exports = (buf, keysize) => {
  keysize = keysize || topKeysize(buf)
  const blocks = transpose(buf, keysize)
  const key = solveBlocks(blocks)
  return repeatingKeyXOR(buf, key)
}
