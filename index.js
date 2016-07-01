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

  if (req.query['hub.verify_token'] === verify_token) {
    res.send(req.query['hub.challenge']);
  }

  res.send('Error, wrong validation token');

});

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  console.log(messaging_events);

  for (var i = 0; i < messaging_events.length; i++) {

    var event = req.body.entry[0].messaging[i];
    var senderId = event.sender.id;

    if (event.message && event.message.text) {
      console.log('in POST webhook');
      console.log(event.message.text);
      var text = event.message.text;
      sendTextMessage(senderId, generateBoyResponse(text));
    }
  }

  res.sendStatus(200);

});

app.listen(PORT, function () {
  console.log('Facebook Messenger echoing bot started on port:' + PORT);
});

function sendTextMessage(senderId, text) {
  var messageData = {
    text: text
  };

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: senderId},
      message: messageData
    }
  }, function (error, response) {

    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }

  });

}