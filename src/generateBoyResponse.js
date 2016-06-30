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

function setSenderState(senderId, state) {
  senderStateDict[senderId] = state;
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

var negativeWords = ['no', 'not', 'nope'];
function isMessageNegative(message) {
  var messageWords = message.split(' ');
  for (var i = 0; i < negativeWords.length; i++) {
    var negativeWord = negativeWords[i];
    if (messageWords.indexOf(negativeWord) >= 0) {
      return true;
    }
  }
  return false;
}

// Given a message, returns a response
module.exports = function(senderId, message) {
  if (isMessageNegative(message)) {
    setSenderState(senderId, AGGRESSIVE_STATE);
  }

  var senderState = getSenderState(senderId);
  if (senderState === HOPEFUL_STATE) {
    return getRandomItemFromList(hopefulResponses);
  } else if (senderState === AGGRESSIVE_STATE) {
    return getRandomItemFromList(aggresiveResponses);
  } else {
    return 'Sender does not have a valid state: ' + senderState;
  }
};