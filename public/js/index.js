let socket = io();

function scrollToBottom() {
    // Selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    console.log('Connected to server');
})

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
})

socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        time: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();

    // let li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // $('#messages').append(li);
})

socket.on('newLocationMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        time: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();

    // let li = $('<li></li>');
    // let a = $('<a target ="_blank">Location</a>')
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
})

// socket.emit('createMessage', {
//     from: 'Yap', 
//     text: 'Hello'
// }, function(data) {
//     console.log('Got it', data);
// })

$('#message-form').on('submit', function(e) {
    e.preventDefault();

    let messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from: '用户', 
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    })

})

let locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location....');
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        })
    }, 
    function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    })
})