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
    'and I have over 300 confirmed kills. ' +
    'I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. ' +
    'You are nothing to me but just another target. ' +
    'I will wipe you the fuck out with precision the likes of which has never been seen ' +
    'before on this Earth, ' +
    'mark my fucking words. ' +
    'You think you can get away with saying that shit to me over the Internet? ' +
    'Think again, fucker. ' +
    'As we speak I am contacting my secret network of spies across the USA ' +
    'and your IP is being traced right now so you better prepare for the storm, maggot. ' +
    'The storm that wipes out the pathetic little thing you call your life. ' +
    'You’re fucking dead, kid. I can be anywhere, anytime, ' +
    'and I can kill you in over seven hundred ways, and that’s just with my bare hands. ' +
    'Not only am I extensively trained in unarmed combat, ' +
    'but I have access to the entire arsenal of the United States Marine Corps and ' +
    'I will use it to its full extent to wipe your miserable ass off the face of the continent, ' +
    'you little shit. ' +
    'If only you could have known what unholy retribution your little “clever” comment ' +
    'was about to bring down upon you, maybe you would have held your fucking tongue. ' +
    'But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. ' +
    'I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo.',
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
    console.log(negativeWordInMessage);
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