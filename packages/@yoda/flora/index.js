'use strict'

/**
 * @module @yoda/flora
 */

/**
 * @class module:@yoda/flora~Agent
 * @classdesc agent of flora connection
 * @param {string} uri - uri of flora service
 * @param {number} [reconnInterval=10000] - reconnect interval time when flora disconnected
 * @param {number} [bufsize=32768] - flora msg buf size
 */

/**
 * start work
 * @method start
 * @memberof module:@yoda/flora~Agent
 */

/**
 * stop work
 * @method close
 * @memberof module:@yoda/flora~Agent
 */

/**
 * unsubscribe flora msg
 * @method unsubscribe
 * @memberof module:@yoda/flora~Agent
 * @param {string} name - msg name for unsubscribe
 */

/**
 * post msg
 * @method post
 * @memberof module:@yoda/flora~Agent
 * @param {string} name - msg name
 * @param {any[]} msg - msg content
 * @param {number} type - msg type (MSGTYPE_INSTANT | MSGTYPE_PERSIST}
 * @returns {number} 0 for success, otherwise error code
 */

/**
 * @class module:@yoda/flora~Response
 * @classdesc Response of Agent.get returns
 */

/**
 * @memberof module:@yoda/flora~Response
 * @member {number} retCode
 */

/**
 * @memberof module:@yoda/flora~Response
 * @member {any[]} msg
 */

/**
 * @memberof module:@yoda/flora~Response
 * @member {string} sender
 */

/**
 * @callback module:@yoda/flora~SubscribeMsgHandler
 * @param {any[]} - msg content
 * @param {number} - type of msg
 * @returns {module:@yoda/flora~Reply} reply message to sender of this REQUEST message
 */

var Agent = require('./flora-cli.node').Agent

/**
 * subscribe flora msg
 * @method subscribe
 * @memberof module:@yoda/flora~Agent
 * @param {string} name - msg name for subscribe
 * @param {module:@yoda/flora~SubscribeMsgHandler} handler - msg handler of received msg
 */
Agent.prototype.subscribe = function (name, handler) {
  this.nativeSubscribe(name, (msg, type) => {
    try {
      return handler(msg, type)
    } catch (e) {
      process.nextTick(() => {
        throw e
      })
    }
  })
}

/**
 * post msg and get response
 * @method get
 * @memberof module:@yoda/flora~Agent
 * @param {string} name - msg name
 * @param {any[]} [msg] - msg content
 * @returns {Promise} promise that resolves with an array of {module:@yoda/flora~Response}
 */
Agent.prototype.get = function (name, msg) {
  if (typeof name !== 'string') {
    return Promise.reject(exports.ERROR_INVALID_PARAM)
  }
  if (msg !== undefined && msg !== null && !Array.isArray(msg)) {
    return Promise.reject(exports.ERROR_INVALID_PARAM)
  }
  return new Promise((resolve, reject) => {
    var r = this.nativeGet(name, msg, resolve)
    if (r !== 0) {
      reject(r)
    }
  })
}

exports.Agent = Agent

/**
 * @class module:@yoda/flora~Reply
 * @classdesc reply message for REQUEST
 * @param {number} code - return code
 * @param {any[]} msg - reply message content
 */
function Reply (code, msg) {
  this.retCode = code
  this.msg = msg
}

exports.Reply = Reply

/**
 * @memberof module:@yoda/flora
 * @member {number} MSGTYPE_INSTANT
 */
exports.MSGTYPE_INSTANT = 0
/**
 * @memberof module:@yoda/flora
 * @member {number} MSGTYPE_PERSIST
 */
exports.MSGTYPE_PERSIST = 1
/**
 * @memberof module:@yoda/flora
 * @member {number} MSGTYPE_REQUEST
 */
exports.MSGTYPE_REQUEST = 2
/**
 * @memberof module:@yoda/flora
 * @member {number} ERROR_INVALID_URI
 */
exports.ERROR_INVALID_URI = -1
/**
 * @memberof module:@yoda/flora
 * @member {number} ERROR_INVALID_PARAM
 */
exports.ERROR_INVALID_PARAM = -2
/**
 * @memberof module:@yoda/flora
 * @member {number} ERROR_NOT_CONNECTED
 */
exports.ERROR_NOT_CONNECTED = -3
