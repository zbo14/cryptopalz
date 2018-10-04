'use strict'

const getBlocks = require('./get-blocks')

/**
 * getUniqueBlocks
 * @param  {Buffer}   buf
 * @param  {Number}   blockLength
 * @return {Buffer[]}
 */
module.exports = (buf, blockLength) => {
  return Array.from(
    new Set(
      getBlocks(buf, blockLength)
        .map(block => block.toString())
    )
  ).map(Buffer.from)
}
