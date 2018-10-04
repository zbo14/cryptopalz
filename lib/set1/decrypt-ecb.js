'use strict'

const crypto = require('crypto')

/**
 * decryptECB
 *
 * @param  {Buffer} buf
 * @param  {Buffer} key
 * @return {Buffer} result
 */
module.exports = (buf, key) => {
  const decipher = crypto.createDecipheriv('aes-128-ecb', key, Buffer.alloc(0))
  decipher.setAutoPadding(false)
  const result = decipher.update(buf)
  decipher.final()
  return result
}
