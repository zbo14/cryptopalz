'use strict'

const mdPad = require('./md-pad')
const uint32 = require('../set3/uint32')

const getChunks = buf => {
  const chunks = []
  for (let i = 0; i + 64 <= buf.length; i += 64) {
    chunks.push(buf.slice(i, i + 64))
  }
  return chunks
}

const getWords = chunk => {
  const words = []
  for (let i = 0; i + 4 <= chunk.length; i += 4) {
    words.push(chunk.slice(i, i + 4).readUInt32BE())
  }
  return words
}

const lrotate = (x, n) => (x << n) | (x >>> (32 - n))

const register = [
  0x67452301,
  0xEFCDAB89,
  0x98BADCFE,
  0x10325476,
  0xC3D2E1F0
]

module.exports = (msg, h = register.slice(0), ml) => {
  msg = mdPad(msg, true, ml)

  let a, b, c, d, e, f, i, k
  let temp, words

  const update = () => {
    temp = uint32(lrotate(a, 5) + f + e + k + words[i])
    e = d
    d = c
    c = uint32(lrotate(b, 30))
    b = a
    a = temp
  }

  getChunks(msg).forEach(chunk => {
    words = getWords(chunk)

    for (i = 16; i < 80; i++) {
      words[i] = lrotate(
        words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16],
        1
      )
    }

    a = h[0]
    b = h[1]
    c = h[2]
    d = h[3]
    e = h[4]

    for (i = 0; i < 20; i++) {
      f = (b & c) | (~b & d)
      k = 0x5A827999
      update()
    }

    for (; i < 40; i++) {
      f = b ^ c ^ d
      k = 0x6ED9EBA1
      update()
    }

    for (; i < 60; i++) {
      f = (b & c) | (b & d) | (c & d)
      k = 0x8F1BBCDC
      update()
    }

    for (; i < 80; i++) {
      f = b ^ c ^ d
      k = 0xCA62C1D6
      update()
    }

    h[0] = uint32(h[0] + a)
    h[1] = uint32(h[1] + b)
    h[2] = uint32(h[2] + c)
    h[3] = uint32(h[3] + d)
    h[4] = uint32(h[4] + e)
  })

  const result = Buffer.alloc(20)

  result.writeUInt32BE(h[0])
  result.writeUInt32BE(h[1], 4)
  result.writeUInt32BE(h[2], 8)
  result.writeUInt32BE(h[3], 12)
  result.writeUInt32BE(h[4], 16)

  return result
}
