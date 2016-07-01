var _ = require('lodash');

var getSenderState = require('./manageSenderState').getSenderState;
var setSenderState = require('./manageSenderState').setSenderState;
var HOPEFUL_STATE = require('./constants').HOPEFUL_STATE;
var AGGRESSIVE_STATE = require('./constants').AGGRESSIVE_STATE;

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
  if (!message) {
    return '';
  }

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