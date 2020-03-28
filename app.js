var express = require('express');
var app = express();

// socket goes here
const io = require('socket.io')();

const port = process.env.PORT || 3040;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//normally its just app.listen but socket needs a server
const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// attach our chat server to our app
io.attach(server); //basically a mailbox, bunch of ports

io.on('connection', function(socket) { // socket is your connection
    console.log('A user has connected...');
    socket.emit('connected', { sID: socket.id, message: "new connection" });

    socket.on('chat_message', function(msg) {
        console.log(msg);
        //anyone connected to this chat will get this message including the sender
        io.emit('new_message', { id: socket.id, message: msg })
    })

    socket.on('disconnect', function() {
        console.log('A user has disconnected.');
    })
});

