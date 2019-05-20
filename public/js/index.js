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

socket.on('newLocationMessage', function(message) {
    let li = $('<li></li>');
    let a = $('<a target ="_blank">My current location</a>')
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
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

let locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        })
    }, 
    function() {
        alert('Unable to fetch location.');
    })
})