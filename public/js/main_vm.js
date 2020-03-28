// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io(),
        sendMessage = new Audio("../media/sharp.mp3"),
        getMessage = new Audio("../media/anxious.mp3");


//the packet is whatever data we sebd through with the connect event
//from the server

//this is data destructuring. Look it up on MDN
function setUserID({sID}) {
    // debugger;
    console.log(sID);
    vm.socketID = sID;
}

//message for 'disconnect'
function showDisconnectMessage() {
    console.log('A user has left.');
}

//push the message like 'posting'
function appendMessage(message) {
    vm.messages.push(message);
    if(message.id === socket.id){
        console.log('my message');
        sendMessage.play();
    }else{
        console.log('other people sent message');
        getMessage.play();
    }
} 

const vm = new Vue({
    data: {
        socketID: "",
        message: "",
        nickname: "",
        messages: []
    },

    methods: {
        // emit a message event
        dispatchMessage() {
            console.log('handle emit message');

            // double pipe means 'or', if there is no first value, then use whatever comes after the double pipe
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || "Anon"
            })

            this.message = ""; // make the msg box blank after hitting submit
        }
    },

    mounted: function() {
        console.log('Vue is done mounting');
    },

    components: {
        newmessage: ChatMessage
    }

}).$mount("#app");



socket.addEventListener('connected', setUserID); //catching an id for the user when they connect
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);
