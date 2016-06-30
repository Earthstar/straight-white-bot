var _ = require('lodash');
var HOPEFUL_STATE = 'hopeful';
var AGGRESSIVE_STATE = 'aggressive';
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


var hopefulResponses = [
  'tits or gtfo',
  'show boobs',
  'gimme kiss',
  'pleas?',
  'ur hot'
];

var aggresiveResponses = [
  '*THREAT OF SEXUAL VIOLENCE*'
];


function getRandomItemFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Given a message, returns a response
module.exports = function(senderId, message) {
  var senderState = getSenderState(senderId);
  if (senderState === HOPEFUL_STATE) {
    return getRandomItemFromList(hopefulResponses);
  } else if (senderState === AGGRESSIVE_STATE) {
    return getRandomItemFromList(aggresiveResponses);
  } else {
    return 'Sender does not have a valid state: ' + senderState;
  }
};