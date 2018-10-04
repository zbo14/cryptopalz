'use strict'

const uint32 = require('./uint32')

const n = 624

module.exports = class {
  seed (seed) {
    this.idx = n
    this.mt = [seed]
    for (let i = 1; i < n; i++) {
      this.mt[i] = uint32(uint32(1812433253 * uint32(this.mt[i - 1] ^ (this.mt[i - 1] >>> 30))) + i)
    }
  }

  twist () {
    let x
    for (let i = 0; i < n; i++) {
      x = uint32(uint32(this.mt[i] & 0x80000000) + uint32(this.mt[(i + 1) % n] & 0x7FFFFFFF))
      if (x % 2) {
        x = uint32((x >>> 1) ^ 0x9908B0DF)
      } else {
        x >>>= 1
      }
      this.mt[i] = uint32(this.mt[(i + 397) % n] ^ x)
    }

    this.idx = 0
  }

  extract () {
    if (this.idx === n) {
      this.twist()
    }

    let y = this.mt[this.idx]

    y = uint32(y ^ (y >>> 11))
    y = uint32(y ^ uint32(uint32(y << 7) & 0x9D2C5680))
    y = uint32(y ^ uint32(uint32(y << 15) & 0xEFC60000))
    y = uint32(y ^ (y >>> 18))

    this.idx++

    return y
  }

  generate (total) {
    if (!total || total === 1) {
      return this.extract()
    }
    const arr = []
    for (let i = 0; i < total; i++) {
      arr.push(this.extract())
    }
    return arr
  }
}
