import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:3000");

let userId = -1;

$(function() {
    // Authentication with username and pwd.
    $('.auth-submit-btn').click(function(e){
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        const action = $(this).attr('value');
        const userInfo = {
            username, password, action
        };
        
        socket.emit('authentication', userInfo);
    });

    // User logout.
    $('.logout-btn').click(function(e){
        e.preventDefault();
        socket.emit('logout');
    });

    // TODO: Post messages.
    $('.post-msg-btn').click(function(e){
        e.preventDefault();
        const message = $('#message-input');
        if(message.val()){
            const msgData = { message: message.val(), userId};
            socket.emit('handlePostMsg', msgData);
            message.val('');
        }else {
            alert('Message should not be empty.');
        }
    })

});

// Change pages
socket.on('switchPage', (id) => {
    userId = id;

    // login or register if the user id is set.
    if(userId !== -1){
        $('#welcome-section').hide();
        $('#chat-room-section').show();
    }
    
    // logout if the user id is -1.
    else {
        $('#welcome-section').show();
        $('#chat-room-section').hide();
    }
});

// Display new message.
socket.on('showNewMsg', (msgData) => {
    let author = msgData.userName;
    if(msgData.userId === userId){
        author = 'Me';
    }

    $('#message-display').append(msgTemplate(author, msgData.message, msgData.timeStamp));
});

// Warning 
socket.on('warning', (message) => {
    alert(message);
})

function msgTemplate(author, message, timeStamp){
    return `
        <div class="message">
            <div class="msg-header">
                <div class="msg-header-author">${author}</div>
                <div class="msg-header-timestamp">${timeStamp}</div>
            </div>
            <div class="msg-content">${message}</div>
        </div>`;
}