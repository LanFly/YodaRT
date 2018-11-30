
/**
 * @namespace yodaRT.activity
 */

var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

module.exports.ActivityTestDescriptor = ActivityTestDescriptor

function ActivityTestDescriptor (activityDescriptor, appId, appHome, runtime) {
  EventEmitter.call(this)
  this._activityDescriptor = activityDescriptor
  this._appId = appId
  this._appHome = appHome
  this._runtime = runtime
}
inherits(ActivityTestDescriptor, EventEmitter)
ActivityTestDescriptor.prototype.toJSON = function toJSON () {
  return ActivityTestDescriptor.prototype
}
Object.assign(ActivityTestDescriptor.prototype,
  {
    type: 'namespace'
  },
  {
    /**
     * Send a voice command to the main process. It requires the permission `ACCESS_VOICE_COMMAND`.
     *
     * @memberof yodaRT.activity.Activity
     * @instance
     * @function voiceCommand
     * @param {string} text - voice asr/text command to be parsed and executed.
     * @returns {Promise<void>}
     */
    voiceCommand: {
      type: 'method',
      returns: 'promise',
      fn: function voiceCommand (text, options) {
        return this._runtime.voiceCommand(text, Object.assign({}, options, { appId: null }))
      }
    },
    nlpCommand: {
      type: 'method',
      returns: 'promise',
      fn: function nlpCommand (nlp, action) {
        return this._runtime.onVoiceCommand('@test', nlp, action)
      }
    }
  }
)
