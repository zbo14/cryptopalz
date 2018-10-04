'use strict'

/**
 * unpad
 * @param  {Buffer} buf
 * @param  {Number} blockLength
 * @return {Buffer}
 */
module.exports = (buf, blockLength = 16) => {
  const last = buf[buf.length - 1]
  if (last <= blockLength && buf.slice(-last).every(val => val === last)) {
    return buf.slice(0, -last)
  }
  return buf
}
