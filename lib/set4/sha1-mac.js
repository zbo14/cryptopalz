'use strict'

const sha1 = require('./sha1')

const key = Buffer.from('ooglyboogly')

exports.digest = msg => sha1(Buffer.concat([ key, msg ]))
exports.auth = (msg, digest) => exports.digest(msg).equals(digest)
