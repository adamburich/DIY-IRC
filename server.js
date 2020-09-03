var express = require('express');
var app = express();
var mongoose = require('mongoose');
var url = 'mongodb+srv://user:Password@cluster0.ybmx2.mongodb.net/<dbname>?retryWrites=true&w=majority';
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var server = app.listen(7777, ()=>{
    console.log("Server started on port " + server.address().port);
});

io.on('connection', () =>{
    console.log('connected');
});

mongoose.connect(url , (err) => { 
    console.log("Connected to mongodb", err);
});

var Message = mongoose.model("Message", {name : String, message : String});

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