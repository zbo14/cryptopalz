'use strict'

/**
 * fixedXOR
 *
 * @param  {Buffer} buf1
 * @param  {Buffer} buf2
 * @return {Buffer} buf
 */
module.exports = (buf1, buf2) => {
  const arr = buf1.reduce((acc, x, i) => acc.concat(x ^ buf2[i]), [])
  return Buffer.from(arr)
}
