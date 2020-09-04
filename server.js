var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var database_url = 'mongodb+srv://user:Password@cluster0.ybmx2.mongodb.net/mini-irc?retryWrites=true&w=majority'

app.get('/msg', (req, res) => {
  Message.find({},(err, msg)=> {
    res.send(msg);
  })
})


app.get('/msg/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, msg)=> {
    res.send(msg);
  })
})


app.post('/msg', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('Wrote message to database');
      io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('Error posting message',error);
  }
  finally{
    console.log('Posted message')
  }

})



io.on('connection', () =>{
  console.log('User connected')
})

mongoose.connect(database_url ,{useMongoClient : true} ,(err) => {
  console.log('Connected',err);
})

var server = http.listen(7777, () => {
  console.log('Server running on port ', server.address().port);
});
