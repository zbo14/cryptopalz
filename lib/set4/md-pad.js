'use strict'

module.exports = (msg, byteOrder, ml = msg.length * 8) => {
  msg = Buffer.from([ ...msg, 0x80 ])
  let x = 56 - msg.length % 64
  x = x < 0 ? 64 + x : x
  const buf = Buffer.alloc(8)
  buf.writeUIntBE(ml, 2, 6)
  return Buffer.concat([
    msg,
    Buffer.alloc(x),
    buf
  ])
}
