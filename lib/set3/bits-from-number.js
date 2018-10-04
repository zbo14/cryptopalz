'use strict'

module.exports = x => {
  return x.toString(2)
    .split('')
    .map(Number)
}
