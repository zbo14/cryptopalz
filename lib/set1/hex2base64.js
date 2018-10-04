'use strict'

/**
 * hex2base64
 *
 * @param  {String} hex
 * @return {String} base64
 */
module.exports = hex => Buffer.from(hex, 'hex').toString('base64')
