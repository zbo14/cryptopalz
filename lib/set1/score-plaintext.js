'use strict'

// from http://www.macfreek.nl/memory/Letter_Distribution
const characterFreqs = {
  a: 0.0655,
  b: 0.0127,
  c: 0.0227,
  d: 0.0335,
  e: 0.1022,
  f: 0.0197,
  g: 0.0164,
  h: 0.0486,
  i: 0.0573,
  j: 0.0011,
  k: 0.0057,
  l: 0.0356,
  m: 0.0202,
  n: 0.0570,
  o: 0.0620,
  p: 0.0150,
  q: 0.0009,
  r: 0.0497,
  s: 0.0533,
  t: 0.0751,
  u: 0.0230,
  v: 0.0079,
  w: 0.0169,
  x: 0.0015,
  y: 0.0147,
  z: 0.0005,
  ' ': 0.1832
}

module.exports = plaintext => {
  return Array.from(plaintext).reduce((acc, x) => {
    return acc + (characterFreqs[x] || 0)
  }, 0)
}
