// Given a message, returns a response
module.exports = function(message) {
  return "Echo: " + message.substring(0, 200);
}