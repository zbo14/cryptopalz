'use strict'

const getBlocks = require('../set1/get-blocks')
const encryptECB = require('./encrypt-ecb')
const fixedXOR = require('../set1/fixed-xor')
const pkcs7Padding = require('./pkcs7-padding')

/**
 * encryptCBC
 *
 * @param  {Buffer} buf
 * @param  {Buffer} key
 * @param  {Buffer} iv
 * @param  {Number} [blockLength=16]
 * @return {Buffer} ciphertext
 */
module.exports = (buf, key, iv, blockLength = 16) => {
  buf = pkcs7Padding(buf, blockLength)
  const ciphertext = []
  const blocks = getBlocks(buf, blockLength)
  blocks.reduce((acc, block) => {
    block = encryptECB(fixedXOR(acc, block), key)
    ciphertext.push(block)
    return block
  }, iv)
  return Buffer.concat(ciphertext)
}
