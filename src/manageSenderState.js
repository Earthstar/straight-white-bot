var _ = require('lodash');
var HOPEFUL_STATE = require('./constants').HOPEFUL_STATE;
var AGGRESSIVE_STATE = require('./constants').AGGRESSIVE_STATE;
// Dictonary of sender to state in state machine
// of form senderId: {state: 'HOPEFUL'}
var senderStateDict = {};

function getSenderState(senderId) {
  var senderState = senderStateDict[senderId];
  if (_.isUndefined(senderState)) {
    senderStateDict[senderId] = HOPEFUL_STATE;
    senderState = HOPEFUL_STATE;
  }
  return senderState;
}

function setSenderState(senderId, state) {
  senderStateDict[senderId] = state;
}

module.exports = {
  getSenderState: getSenderState,
  setSenderState: setSenderState
};