'use strict'

/**
 * getBlocks
 *
 * @param  {Buffer}   buf
 * @param  {Numbers}  [blockLength=16]
 * @param  {Array}    [acc=[]]
 * @return {Buffer[]} blocks
 */
const getBlocks = (buf, blockLength = 16, acc = []) => {
  const block = buf.slice(0, blockLength)
  acc.push(block)

  if (block.length !== blockLength) {
    return acc.filter(block => block.length)
  }

  return getBlocks(buf.slice(blockLength), blockLength, acc)
}

module.exports = getBlocks
