let spicedPg = require('spiced-pg');

let dbUrl = process.env.DATABASE_URL || `postgres:${require('../secrets').dbUser}@localhost:5432/network`;

let db = spicedPg(dbUrl);


exports.checkStatus = (userId, otherUserId) => {
    return db.query(`SELECT * FROM friend_status WHERE requester_id=$1 AND receiver_id=$2 OR requester_id=$2 AND receiver_id=$1`, [userId, otherUserId])
    .then((results) => {
        if (!results.rows[0]) {
            return 0
        } else {
            return (results)
        }
    })
}

exports.makeBasicRequest = (userId, otherUserId) => {
    return db.query(`INSERT INTO friend_status (requester_id, receiver_id, status_code) VALUES ($1, $2, 1) RETURNING *`, [userId, otherUserId])
    then((results)=> {
        return results
    })
}

exports.acceptBasicRequest = (userId, otherUserId) => {
    return db.query(`UPDATE friend_status SET status_code=2 WHERE requester_id=$2 and receiver_id=$1 RETURNING *`, [userId, otherUserId])
    then((results)=> {
        return results
    })
}

exports.denyRequest = (userId, otherUserId) => {
    return db.query(`UPDATE friend_status SET status_code=3 WHERE requester_id=$2 and receiver_id=$1 RETURNING *`, [userId, otherUserId])
    then((results)=> {
        return results
    })
}

exports.cancelRequest = (userId, otherUserId) => {
    return db.query(`UPDATE friend_status SET status_code=4 WHERE requester_id=$1 and receiver_id=$2 RETURNING *`, [userId, otherUserId])
    then((results)=> {
        return results
    })
}

exports.unfriend = (userId, otherUserId) => {
    return db.query(`UPDATE friend_status SET status_code=5 WHERE requester_id=$1 AND receiver_id=$2 OR requester_id=$2 AND receiver_id=$1 RETURNING *`, [userId, otherUserId])
    .then((results)=> {
        return results
    })
}

exports.makeNewRequest = (userId, otherUserId) => {
    return db.query(`DELETE FROM friend_status WHERE requester_id=$1 AND receiver_id=$2 OR requester_id=$2 AND receiver_id=$1`, [userId, otherUserId])
    .then((results) => {
        return db.query(`INSERT INTO friend_status (requester_id, receiver_id, status_code) VALUES ($1, $2, 1) RETURNING *`, [userId, otherUserId])
        .then((results) => {
            return results
        })
    })
}

exports.blockUser = (userId, otherUserId) => {

}

exports.getRelations = (userId) => {
    const PENDING = 1, ACCEPTED = 2;

    const q = `
        SELECT users.id, first, last, pic_url, status_code
        FROM friend_status
        JOIN users
        ON (status_code = ${PENDING} AND receiver_id = $1 AND requester_id = users.id)
        OR (status_code = ${ACCEPTED} AND receiver_id = $1 AND requester_id = users.id)
        OR (status_code = ${ACCEPTED} AND requester_id = $1 AND receiver_id = users.id)
    `;

    return db.query(q, [userId])
}


exports.getFriendsAndInfo = (userId) => {
    let array = [];
    return db.query(`SELECT * FROM friend_status WHERE requester_id =$1 AND status_code=2 OR receiver_id=$1 AND status_code=2`, [userId])
    .then((results)=> {
        array = results.rows.map((row) => {
            if (row.receiver_id!==userId) {
                return row.receiver_id
            } else if (row.requester_id!==userId) {
                return row.requester_id
            }
        })
        return array
    })
    .then((results)=> {
        if (results.length>0) {
            let string =`SELECT * FROM users WHERE id=$1`
            for (let i=1; i<results.length; i++) {
                string = string.concat(' OR id=$' + (i+1))
            }
            return db.query(string, results)
        } else {
            return null;
        }
    })
}

exports.getRequestsAndInfo = (userId) => {
    return db.query(`SELECT users.id, first, last, pic_url FROM friend_status RIGHT JOIN users ON (users.id=friend_status.requester_id) WHERE receiver_id = $1 AND status_code=1`, [userId])
}
