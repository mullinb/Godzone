export function reducer(state = {}, action) {
    console.log(action);
    if (action.type == 'INITIALIZE_PAGE') {
        const user = Object.assign({}, state.user, {
            requests: action.requests
        })
        return Object.assign({}, state, { user });
    }
    if (action.type == 'USER_ACCEPTS') {
        const user = Object.assign({}, state.user, {
            requests: state.user.requests.map((request) => {
                console.log(request.id, action.id)
                if (request.id==action.id) {
                    request.status_code=2
                }
                return request;
            }),
        });
        return Object.assign({}, state, { user });
    }
    if (action.type == 'USER_REJECTS') {
        const user = Object.assign({}, state.user, {
            requests: state.user.requests.map((request) => {
                if (request.id==action.id) {
                    request.status_code=3
                }
                return request;
            }),
        });
        return Object.assign({}, state, { user });
    }
    if (action.type == 'USER_UNFRIENDS') {
        const user = Object.assign({}, state.user, {
            requests: state.user.requests.map((request) => {
                if (request.id==action.id) {
                    request.status_code=5
                }
                return request;
            }),
        });
        return Object.assign({}, state, { user });
    }
    if (action.type == 'INITIALIZE_ONLINE_USERS') {
        state = Object.assign({}, state, {
            onlineUsers: action.users
        })
    }
    if (action.type == 'ADD_ONLINE_USER') {
        state = Object.assign({}, state, {
            onlineUsers: [ ...state.onlineUsers, action.user ]
        })
    }
    if (action.type == 'REMOVE_ONLINE_USER') {
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter((user) => {
                if (user.id==action.userId) {
                    return false;
                }
                else return true;
            })
        })
    }
    if (action.type == 'INITIALIZE_CHAT_USERS') {
        state = Object.assign({}, state, {
            chatUsers: action.users
        })
    }
    if (action.type == 'ADD_CHAT_USER') {
        state = Object.assign({}, state, {
            chatUsers: [ ...state.chatUsers, action.user ]
        })
    }
    if (action.type == 'REMOVE_CHAT_USER') {
        state = Object.assign({}, state, {
            chatUsers: state.chatUsers.filter((user) => {
                if (user.id==action.userId) {
                    return false;
                }
                else return true;
            })
        })
    }
    if (action.type == 'POPULATE_CHAT') {
        state = Object.assign({}, state, {
            messages: action.messages
        })
    }
    if (action.type == 'POPULATE_NEW_MESSAGE') {
        console.log(state.messages, action.message);
        state = Object.assign({}, state, {
            messages: [ ...state.messages, action.message ]
        })
    }

    return state;
}
