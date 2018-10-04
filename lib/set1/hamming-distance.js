'use strict'

/**
 * hammingDistance
 *
 * @param  {Buffer} buf1
 * @param  {Buffer} buf2
 * @return {Number} distance
 */
module.exports = (buf1, buf2) => {
  let distance = 0
  let value

  for (let i = 0; i < buf1.length && i < buf2.length; i++) {
    value = buf1[i] ^ buf2[i]
    while (value) {
      distance += value & 1
      value >>= 1
    }
  }

  return distance
}
