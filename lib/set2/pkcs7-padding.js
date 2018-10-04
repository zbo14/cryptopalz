'use strict'

/**
 * pkcs7Padding
 *
 * @param  {Buffer} buf
 * @param  {Number} blockLength
 * @return {Buffer} padded
 */
module.exports = (buf, blockLength) => {
  const mod = buf.length % blockLength
  if (!mod) return buf
  const dif = blockLength - mod
  const pad = Buffer.alloc(dif).fill(dif)
  return Buffer.concat([buf, pad])
}
