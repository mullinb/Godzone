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

}

exports.cancelRequest = (userId, otherUserId) => {

}

exports.blockUser = (userId, otherUserId) => {
    
}
