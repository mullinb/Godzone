import axios from './axios';

export function getFriends() {
    return axios.get("/friends/getfriends")
    .then(({data}) => {
        if (data.success) {
            return {
                type: 'INITIALIZE_PAGE',
                requests: data.requests
            };
        } else {
            console.log("THIS IS AN ERROR" + data.error);
            return;
        }
    })
}

export function initializeOnlineUsers(users) {
    return {
        type: 'INITIALIZE_ONLINE_USERS',
        users: users
    }
}

export function addOnlineUser(user) {
    return {
        type: 'ADD_ONLINE_USER',
        user
    }
}

export function removeOnlineUser(userId) {
    return {
        type: 'REMOVE_ONLINE_USER',
        userId
    }
}

export function initializeChatUsers(users) {
    return {
        type: "INITIALIZE_CHAT_USERS",
        users
    }
}

export function addChatUser(user) {
    return {
        type: "ADD_CHAT_USER",
        user
    }
}

export function removeChatUser(user) {
    return {
        type: "REMOVE_CHAT_USER",
        user
    }
}

export function populateChatMessages(data) {
    console.log(data);
    return {
        type: "POPULATE_CHAT",
        data
    }
}

export function populateNewMessage(data) {
    return {
        type: "POPULATE_NEW_MESSAGE",
        message: data
    }
}

export function buttonClick(e) {
    let click = e.target.name
    let clickid = e.target.id
    if (click==="accept") {
        return axios.post('/friends/friendAcceptOrReject', {
            id: clickid,
            status: 1,
            choice: click

        })
        .then(({data}) => {
            if (data.success) {
                return {
                    type: 'USER_ACCEPTS',
                    id: clickid
                };
            }
        })
    } else if (click==="reject") {
        return axios.post('/friends/friendAcceptOrReject', {
            id: clickid,
            status: 1,
            choice: click
        })
        .then(({data}) => {
            if (data.success) {
                return {
                    type: 'USER_REJECTS',
                    id: clickid
                };
            }
        })
    } else if (click==="excom") {
        return axios.post('/friends/unfriend', {
            id: clickid,
            status: 2,
            choice: click
        })
        .then(({data}) => {
            if (data.success) {
                return {
                    type: 'USER_UNFRIENDS',
                    id: clickid
                }
            }
        })
    } else {
        return {
            type: 'BUTTON_CLICK',
        }
    }
}
