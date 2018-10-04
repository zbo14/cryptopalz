'use strict'

/**
 * repeatingKeyXOR
 *
 * @param  {Buffer} plaintext
 * @param  {Buffer} key
 * @return {Buffer} result
 */
module.exports = (plaintext, key) => {
  const result = []
  for (let i = 0; i < plaintext.length; i++) {
    result[i] = plaintext[i] ^ key[i % key.length]
  }
  return Buffer.from(result)
}
