'use strict'

const fixedXOR = require('../set1/fixed-xor')
const encryptECB = require('../set2/encrypt-ecb')

module.exports = (plaintext, key, nonce = Buffer.alloc(8)) => {
  const buf = Buffer.concat([ nonce, Buffer.alloc(8) ])
  const ciphertext = []

  let block
  let count = 0
  let begin = 0
  let end

  while (begin < plaintext.length) {
    end = Math.min(begin + 16, plaintext.length)
    buf.writeUIntLE(count, 8, 6)
    block = encryptECB(buf, key)
    ciphertext.push(
      ...fixedXOR(
        block.slice(0, end - begin),
        plaintext.slice(begin, end)
      )
    )
    count++
    begin += 16
  }

  return Buffer.from(ciphertext)
}
