const { getSessionFromSocket } = require('socket-cookie-session');
const friends = require("../models/friendships");
const config = require('../config');
var onlineUsers = new Set;
var chatUsers = new Set;


module.exports = function(io) {

    io.on('connection', function(socket) {
        const session = getSessionFromSocket(socket, {
            secret: 'a really hard to guess secret'
        });

        if (!session || !session.user) {
            return socket.disconnect(true);
        }

        const userId = session.user.id;

        if (!onlineUsers.has(userId)) {
            friends.getUsersByIds([userId])
            .then((results) => {
                if (results.rows[0].pic_url) {
                    results.rows[0].pic_url = config.s3Url.concat(results.rows[0].pic_url);
                }
                onlineUsers.add(userId);
                io.sockets.sockets[socket.id].broadcast.emit('userJoined', {
                    userJoined: results.rows[0]
                })
            })
            .catch(err => console.log(err))
        }


        socket.on('disconnect', function() {
            onlineUsers.delete(userId);
            chatUsers.delete(userId);
            io.sockets.emit('userLeft', {
                userLeft: userId
            })
            io.sockets.emit('removeChatUser', {
                userId
            })
        });

        socket.on('getOnlineUsers', function() {
            let array = [];
            onlineUsers.forEach(x => array.push(x));
            array = array.filter((user) => {
                if (user == session.user.id) {
                    return false;
                } else return true;
            })
            friends.getUsersByIds(array)
            .then((results) => {
                for (let i=0; i<results.rows.length; i++) {
                    if (results.rows[i].pic_url) {
                        results.rows[i].pic_url = config.s3Url.concat(results.rows[i].pic_url);
                    }
                }
                io.sockets.sockets[socket.id].emit('onlineUsers', {
                    onlineUsers: results.rows
                })
            })
        });

        socket.on('joinedChat', () => {
            if (!chatUsers.has(userId)) {
                chatUsers.add(userId);
                let array = [];
                chatUsers.forEach(x => array.push(x));
                friends.getUsersByIds(array)
                .then((results) => {
                    for (let i=0; i<results.rows.length; i++) {
                        if (results.rows[i].pic_url) {
                            results.rows[i].pic_url = config.s3Url.concat(results.rows[i].pic_url);
                        }
                    }
                    io.sockets.sockets[socket.id].emit('chatUsers', results.rows)
                })
                .catch(err => console.log(err))

                friends.getUsersByIds([userId])
                .then((results) => {
                    if (results.rows[0].pic_url) {
                        results.rows[0].pic_url = config.s3Url.concat(results.rows[0].pic_url);
                    }
                    io.sockets.sockets[socket.id].broadcast.emit('addChatUser', results.rows[0])
                })
                .catch(err => console.log(err))

                friends.getAllUsers()
                .then((results) => {
                    for (let i=0; i<results.rows.length; i++) {
                        if (results.rows[i].pic_url) {
                            results.rows[i].pic_url = config.s3Url.concat(results.rows[i].pic_url);
                        }
                    }
                    io.sockets.sockets[socket.id].emit('populateAllUsers', results.rows)
                })
                .catch(err => console.log(err))
            }
        })

        friends.getChatMessages()
        .then((results) => {
            io.sockets.sockets[socket.id].emit('chatMessages', results.rows)
        })

        socket.on('sendMessage', (message) => {
            friends.logChat(message, userId)
            .then((result) => {
                io.sockets.emit('newMessage', result.rows[0])
            })
        })

        socket.on('leftChat', () => {
            chatUsers.delete(userId);
            io.sockets.emit('removeChatUser', {
                userId
            })
        })

        io.sockets.sockets[socket.id].emit('welcome', {
            message: 'Welome. It is nice to see you'
        });
    });

};
