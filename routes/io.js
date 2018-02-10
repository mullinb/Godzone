const { getSessionFromSocket } = require('socket-cookie-session');


module.exports = function(io) {

    io.on('connection', function(socket) {
        const session = getSessionFromSocket(socket, {
            secret: 'a really hard to guess secret'
        });

        if (!session || !session.user) {
            return socket.disconnect(true);
        }

        const userId = session.user.id;
        console.log(`socket with the id ${socket.id} and user id ${userId} is now connected`);

        socket.on('disconnect', function() {
            console.log(`socket with the id ${socket.id} and user id ${userId} is now disconnected`);
        });

        socket.on('getOnlineFriends', function(data) {
            console.log(data)
        });

        socket.on ('thanks', function () {
            console.log(socket.id)
            io.sockets.sockets[socket.id].emit('request', {
                message: "You're logged in, here's yourdang ole list"
            });
        })

        socket.emit('welcome', {
            message: 'Welome. It is nice to see you'
        });
    });

};
