const express = require('express');
const app = express();
const user = require("../models/user");
const friends = require("../models/friendships")
const config = require('../config');
let spicedPg = require('spiced-pg');
var path = require('path');
const fs = require('fs');

const router = express.Router();
module.exports = router;

let dbUrl = process.env.DATABASE_URL || `postgres:${require('../secrets').dbUser}@localhost:5432/network`;

let db = spicedPg(dbUrl);


router.get('/friendstatus/:id', (req, res) => {
    if (req.session.user) {
        friends.checkStatus(req.session.user.id, req.params.id)
        .then((results) => {
            if (results === 0) {
                res.json({
                    success: true,
                    friendRequestStatus: 0,
                    friendRequestInitiator: 1
                })
            } else {
                res.json({
                    success: true,
                    friendRequestStatus: results.rows[0].status_code,
                    friendRequestInitiator: req.session.user.id === results.rows[0].requester_id ? 1 : 2
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    } else {}
})

router.get("/getfriends", (req, res) => {
    friends.getRelations(req.session.user.id)
    .then(results => {
        if (results) {
            for (let i=0; i<results.rows.length; i++) {
                if (results.rows[i].pic_url) {
                    results.rows[i].pic_url = config.s3Url.concat(results.rows[0].pic_url);
                }
            }
            res.json({
                success: true,
                requests: results.rows
            })
        } else {
            res.json({
                success: false
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.json({
            success: false,
            error: err
        })
    })
})


router.post("/friendsmanager/", (req, res) => {
    friends.checkStatus(req.session.user.id, req.body.id)
    .then((results) => {
        if (results===0) {
            if (results !== req.body.status) {                 //SOMETHING WEIRD CLIENT-SIDE
                res.json({
                    success: false,
                    error: "desynced"
                })
            } else {                                            //BASIC FRIEND REQUEST INITATION
                friends.makeBasicRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            }
        } else if (results.rows[0].status_code!==req.body.status) {
        //SOMETHING ELSE WEIRD
            res.json({
                success: false,
                error: "desynced"
            })
        } else if (results.rows[0].status_code===req.body.status) {
       //AGREEMENT BETWEEN SERVER AND CLIENT
            if (req.body.status===1 && req.body.initiator===2) {               //BASIC FRIEND REQUEST ACCEPTANCE
                friends.acceptBasicRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0])
                    res.json({
                        success: true,
                        friendRequestStatus: results.rows[0].status_code,
                        friendRequestInitiator: req.body.initiator
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
            } else if (req.body.status===1 && req.body.initiator===1) {             //INITIATOR CANCELS REQUEST
                friends.cancelRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0])
                    res.json({
                        success: true,
                        friendRequestStatus: results.rows[0].status_code,
                        friendRequestInitiator: req.body.initiator
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
            } else if (req.body.status===2) { // EITHER USER UNFRIENDS
                friends.unfriend(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0])
                    res.json({
                        success: true,
                        friendRequestStatus: results.rows[0].status_code,
                        friendRequestInitiator: 1
                    })
                })
            } else if (req.body.status===3 && req.body.initiator===1) { // INITIATOR HAS ALREADY BEEN DENIED, THIS SHOULD NEVER HAPPEN / RESULT IN A SPECIAL MESSAGE
                res.json({
                    success: false,
                    error: "you gon have ta wait"
                })
            } else if (req.body.status===3 && req.body.initiator===2) {  // INITIAL REQUEST WAS DENIED BY RECEIVER, HOWEVER RECEIVER MAY MAKE NEW REQUEST
                friends.makeNewRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            } else if (req.body.status===4) { // ORIGINAL INITIATOR HAS ABANDONED REQUEST, BUT EITHER MAY INITIATE NEW REQUEST
                friends.makeNewRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            } else if (req.body.status===5) { //INITIATOR OF UNFRIENDING MUST BE REDEFINED --
                friends.makeNewRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            } else if (req.body.status===6) { //INITIATOR OF BLOCK MUST BE REDEFINED -- perhaps a separate table??
                friends.blockUser(req.session.user.id, req.body.id)
                .then((results) => {
                    res.json({
                        success: true
                    })
                })
            }
        }
    })
    .catch((err) => {
        console.log(err);
    })
})

router.post("/friendAcceptOrReject/", (req, res) => {
    friends.checkStatus(req.session.user.id, req.body.id)
    .then((results) => {
        if (results) {
            if (results.rows[0] && results.rows[0].status_code !== req.body.status) {                 //SOMETHING WEIRD CLIENT-SIDE
                res.json({
                    success: false,
                    error: "desynced"
                })
            } else if (req.body.choice=="accept") {
                console.log('trying to accept')
                friends.acceptBasicRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            } else if (req.body.choice==="reject") {
                console.log('inside');
                friends.denyRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            }
        }
    })
})

router.post("/unfriend", (req, res) => {
    friends.checkStatus(req.session.user.id, req.body.id)
    .then((results) => {
        if (results) {
            if (results.rows[0] && results.rows[0].status_code !== req.body.status) {                 //SOMETHING WEIRD CLIENT-SIDE
                res.json({
                    success: false,
                    error: "desynced"
                })
            } else if (req.body.choice==="excom") {
                friends.denyRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0]) {
                        res.json({
                            success: true,
                            friendRequestStatus: results.rows[0].status_code,
                            friendRequestInitiator: 1
                        })
                    }
                })
            }
        }
    })
    .catch(err=> {
        console.log(err);
    })
})
