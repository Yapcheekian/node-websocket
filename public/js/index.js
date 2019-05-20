let socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
})

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
})

socket.on('newMessage', (message) => {
    console.log('newMessage', message);
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
})

// socket.emit('createMessage', {
//     from: 'Yap', 
//     text: 'Hello'
// }, function(data) {
//     console.log('Got it', data);
// })

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: '用户', 
        text: $('[name=message]').val()
    }, function(data) {
        console.log('Got it', data);
    })

})