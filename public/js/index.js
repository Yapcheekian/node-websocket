let socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
})

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
})

socket.on('newMessage', (email) => {
    console.log('newMessage', email);
})