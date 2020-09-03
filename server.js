var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user:Password@cluster0.ybmx2.mongodb.net/mini-irc?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
  const collection = client.db("mini-irc").collection("messages");
  // perform actions on the collection object
  client.close();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var server = app.listen(7777, ()=>{
    console.log("Server started on port " + server.address().port);
});

var Message = mongoose.model("Message", {name : String, message : String});

io.on('connection', () =>{
    console.log('connected');
});

app.use(express.static(__dirname));

app.get('/messages', (req, res) => {
    message.find({},(err, messages)=> {
      res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    });
  });