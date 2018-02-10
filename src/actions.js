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

export function getAllUsers() {
    return axios.get("/friends/getAllUsers")
    .then(({data})) => {
        if (data.success) {
            return {
                type: 'INITIALIZE_ONLINE_USERS',
                onlineUsers: data.onlineUsers
            }
        } else {
            console.log("THIS IS AN ERROR" + data.error);
            return;
        }
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
