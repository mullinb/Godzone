import * as io from 'socket.io-client';
import { store } from './start';
import { onlineUser, userJoined, userLeft } from './actions';

let socket;

export function init() {
    if (!socket) {
        socket = io.connect();
    }

    socket.on('welcome', function(data) {
        console.log(data);
        socket.emit('thanks', {
            message: 'Thank you. It is great to be here.'
        });
    });
    // onlineUser(socket);
    // userJoined(socket);
    // userLeft(socket);
}
