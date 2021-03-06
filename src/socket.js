import * as io from 'socket.io-client';
import { store } from './start';
import { initializeOnlineUsers, addOnlineUser, removeOnlineUser, initializeChatUsers, addChatUser, removeChatUser, populateChatMessages, populateNewMessage, populateAllUsers, addToAllUsers, updateOnAllUsers } from './actions';

let socket;


export function init() {
    if (!socket) {
        socket = io.connect();
    }
    socket.on('welcome', () => {
        socket.emit('getOnlineUsers');
    });

    socket.on('onlineUsers', ({onlineUsers}) => {
        store.dispatch(initializeOnlineUsers(onlineUsers));
    })

    socket.on('userJoined', ({userJoined}) => {
        store.dispatch(addOnlineUser(userJoined));
    })

    socket.on('userLeft', ({userLeft}) => {
        store.dispatch(removeOnlineUser(userLeft));
    })
}

export function initChat() {
    if (!socket) {
        socket = io.connect();
    }

    socket.emit('joinedChat');

    socket.on('chatUsers', gettingChatUsers)

    socket.on('addChatUser', addingChatUser)

    socket.on('removeChatUser', removingChatUser)

    socket.on('chatMessages', gettingMessages);

    socket.on('newMessage', gettingNewMessage);

    socket.on('populateAllUsers', gettingAllUsers);

    socket.on('addToAllUsers', addingToAllUsers);

    socket.on('updateOnAllUsers', updatingAllUsers);
}

function gettingChatUsers(users) {
    store.dispatch(initializeChatUsers(users))
}

function addingChatUser (user) {
    store.dispatch(addChatUser(user))
}

function removingChatUser ({userId}) {
    store.dispatch(removeChatUser(userId))
}

function gettingMessages(data) {
    store.dispatch(populateChatMessages(data))
}

function gettingNewMessage(data) {
    store.dispatch(populateNewMessage(data))
}

function gettingAllUsers(data) {
    store.dispatch(populateAllUsers(data))
}

function addingToAllUsers(data) {
    store.dispatch(addToAllUsers(data))
}

function updatingAllUsers(data) {
    store.dispatch(updateOnAllUsers(data))
}

export function sendChatMessage(message) {
    socket.emit('sendMessage', {
        message
    })
}

export function leaveChat() {
    socket.removeListener('chatUsers', gettingChatUsers);
    socket.removeListener('addChatUser', addingChatUser);
    socket.removeListener('removeChatUser', removingChatUser);
    socket.removeListener('chatMessages', gettingMessages);
    socket.removeListener('newMessage', gettingNewMessage);
    socket.removeListener('populateAllUsers', gettingAllUsers);
    socket.removeListener('addToAllUsers', addingToAllUsers);
    socket.removeListener('updateOnAllusers', updatingAllUsers);
    socket.emit('leftChat');
}
