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
  'ur hot',
  '3some?',
  ';)',
  'u want in on this?',
  '8==>',
  'dtf?',
  'hey sexy',
  'call me daddy',
  'hey',
  'send nudes',
  'pics?',
  'succ?',
  'can i lick ur butthole?',
  'im hortny',
  'anyone home',
];

const aggresiveResponses = [
  'u birch',
  'ur ugly',
  'fuck u',
  'ur urutus is a rasin',
  'im entitled to ur body',
  'pay attention to me',
  'my feelings are more important than your safety',
  'dum ho',
  'What the fuck did you just fucking say about me, you little bitch? ' +
    'I’ll have you know I graduated top of my class in the Navy Seals, ' +
    'and I’ve been involved in numerous secret raids on Al-Quaeda, ' +
    'and I have over 300 confirmed kills. ',
  'ur loose',
  'im mad that u didnt put out',
];

function getRandomItemFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

var negativeWords = ['no', 'not', 'nope'];

function isMessageNegative(message) {
  var messageWords = message.split(' ');
  for (var i = 0; i < negativeWords.length; i++) {
    var negativeWord = negativeWords[i];
    var negativeWordInMessage = messageWords.find(function(messageWord) {
      return negativeWord.toUpperCase() === messageWord.toUpperCase();
    });
    if (!!negativeWordInMessage) {
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