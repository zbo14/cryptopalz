'use strict'

const getUniqueBlocks = require('./get-unique-blocks')

/**
 * detectECB
 *
 * @param  {Buffer[]} bufs
 * @return {Buffer}   buf
 */
module.exports = bufs => {
  const uniqueBlocks = bufs.map(buf => getUniqueBlocks(buf).length)
  const idx = uniqueBlocks.indexOf(Math.min(...uniqueBlocks))
  return bufs[idx]
}
