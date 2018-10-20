const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`app listening on port ${port}!`));
const io = require('socket.io')(server);
const apiai = require('apiai')('7abb6e84182543989d9fb4e17757451e');
// const apiai = require('apiai')('258d5e19e50d48c8a8ec8a98cd222de2');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');
});


app.get('/',(req,res) => {
	res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: "ohm"
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});

