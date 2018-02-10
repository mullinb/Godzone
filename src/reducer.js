


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
            onlineUsers: action.onlineUsers
        })
    }
    if (action.type == 'USER_JOINED') {
        state = Object.assign({}, state, {
            onlineUsers: [ ...state.onlineUsers, action.user ]
        })
    }
    if (action.type == 'USER_LEFT') {
        state = Object.assign({}, state, {
            onlineUsers: [ ...state.onlineUsers, ]
        })
    }
    return state;
}
