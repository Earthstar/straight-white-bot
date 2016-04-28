var responses = [
  'tits or gtfo',
  'show boobs',
  'gimme kiss',
  'pleas?',
  'ur hot'
]

function getRandomItemFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Given a message, returns a response
module.exports = function(message) {
  return getRandomItemFromList(responses);
}