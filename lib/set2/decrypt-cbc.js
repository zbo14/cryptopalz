'use strict'

const getBlocks = require('../set1/get-blocks')
const decryptECB = require('../set1/decrypt-ecb')
const fixedXOR = require('../set1/fixed-xor')

module.exports = (buf, key, iv, blockSize = 16) => {
  const blocks = getBlocks(buf, blockSize)
  const plaintext = []
  let block
  for (let i = blocks.length - 1; i > 0; i--) {
    block = fixedXOR(decryptECB(blocks[i], key), blocks[i - 1])
    plaintext.unshift(block)
  }
  block = fixedXOR(decryptECB(blocks[0], key), iv)
  plaintext.unshift(block)
  return Buffer.concat(plaintext)
}
