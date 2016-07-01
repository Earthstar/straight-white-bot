var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var generateBoyResponse = require('./src/generateBoyResponse');

var app = express();

var verify_token = process.env.VERIFY_TOKEN;
var token = process.env.PAGE_ACCESS_TOKEN;
var PORT = process.env.PORT || 1337;

app.use(bodyParser.json());

app.get('/', function (req, res) {

  res.send('Hello World! This is the bot\'s root endpoint!');

});

app.get('/webhook/', function (req, res) {

  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === verify_token) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook/', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          console.log(messagingEvent);
          handleMessageEvent(messagingEvent);
        } else {
          console.log("Received messaging event that isn't handled", messagingEvent);
        }
      });
    });
  }

  res.sendStatus(200);

});

app.listen(PORT, function () {
  console.log('Facebook Messenger echoing bot started on port:' + PORT);
});

// Handles FB messaging events of type 'message'
function handleMessageEvent(event) {
  var senderId = event.sender.id;
  var message = event.message;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  var botResponse;
  if (messageText) {
    botResponse = generateBoyResponse(senderId, messageText);
  } else if (messageAttachments) {
    botResponse = 'thats hot';
  }

  var textMessage = formatTextMessage(senderId, botResponse);
  callSendAPI(textMessage);
}

function formatTextMessage(recipientId, messageText) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(error);
    }
  });
}
