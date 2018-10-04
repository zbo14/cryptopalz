'use strict'

const crypto = require('crypto')

/**
 * encryptECB
 * @param  {Buffer} buf
 * @param  {Buffer} key
 * @return {Buffer}
 */
module.exports = (buf, key) => {
  const cipher = crypto.createCipheriv('aes-128-ecb', key, Buffer.alloc(0))
  const result = cipher.update(buf)
  cipher.final()
  return result
}
