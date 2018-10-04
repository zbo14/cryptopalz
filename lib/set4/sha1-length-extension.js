'use strict'

const assert = require('assert')
const getBlocks = require('../set1/get-blocks')
const mdPad = require('./md-pad')
const sha1MAC = require('./sha1-mac')
const sha1 = require('./sha1')

const forge = (msg, extra, keyLength) => {
  msg = mdPad(
    Buffer.concat([
      Buffer.alloc(keyLength),
      msg
    ])
  ).slice(keyLength)

  return Buffer.concat([msg, extra])
}

module.exports = (msg, extra) => {
  const digest = sha1MAC.digest(msg)
  const h = getBlocks(digest, 4).map(block => block.readUInt32BE())
  let forged
  let result
  for (let keyLength = 1; keyLength < 100; keyLength++) {
    forged = forge(msg, extra, keyLength)
    result = sha1(extra, h.slice(0), (keyLength + forged.length) * 8)
    if (result.equals(sha1MAC.digest(forged))) {
      console.log('Successfully forged message')
      return
    }
  }
  assert.ok(false)
}
