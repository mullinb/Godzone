const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require("cookie-session");
const user = require("./models/user");
const friends = require("./models/friendships")
const bodyParser = require('body-parser');
const config = require('./config');
let spicedPg = require('spiced-pg');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const fs = require('fs');
const csurf = require('csurf');


let dbUrl = process.env.DATABASE_URL || `postgres:${require('./secrets').dbUser}@localhost:5432/network`;

let db = spicedPg(dbUrl);

app.use(cookieSession({
    secret: 'a really hard to guess secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    extended: false
}));

app.use(compression());

const knox = require('knox');
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: process.env.AWS_KEY || secrets.AWS_KEY,
    secret: process.env.AWS_SECRET || secrets.AWS_SECRET,
    bucket: 'fluxlymoppings'
});

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 12097152
    }
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use(express.static('./public'));

app.get('/logout', (req, res) => {
    req.session = null;
    res.json({
        success: true
    })
})

app.get('/selfUser', (req, res) => {
    if (req.session.user) {
        user.profile(req.session.user.id)
        .then((results) => {
            if (results.rows[0].pic_url) {
                var imgUrl = config.s3Url.concat(results.rows[0].pic_url);
            }
            res.json({
                success: true,
                userInfo: {
                    id: results.rows[0].id,
                    first: results.rows[0].first,
                    last: results.rows[0].last,
                    bio: results.rows[0].bio,
                    picUrl: imgUrl
                }
            })
        })
        .catch((err) => {
            console.log(err);
        })
    } else {}
})

app.get('/userProfile/:id', (req, res) => {
    if (req.session.user) {
        user.profile(req.params.id)
        .then((results) => {
            if (results.rows[0].pic_url) {
                var imgUrl = config.s3Url.concat(results.rows[0].pic_url);
            }
            res.json({
                success: true,
                userInfo: {
                    id: results.rows[0].id,
                    first: results.rows[0].first,
                    last: results.rows[0].last,
                    bio: results.rows[0].bio,
                    picUrl: imgUrl
                }
            })
        })
        .catch((err) => {
            console.log(err);
        })
    } else {}
})


app.get('/friendstatus/:id', (req, res) => {
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

app.post("/friendsmanager/", (req, res) => {
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
            if (req.body.status===1) {               //BASIC FRIEND REQUEST ACCEPTANCE
                friends.acceptBasicRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    console.log(results);
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
            } else if (req.body.status===2 && req.body.initiator===1) {  //INITIATOR CANCELS REQUEST
                friends.cancelRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    if (results.rows[0])
                    res.json({
                        success: true,
                        friendRequestStatus: results.rows[0].status_code,
                        friendRequestInitiator: 1
                    })
                })
            } else if (req.body.status===2 && req.body.initiator===2) { //RECEIVER DENIES REQUEST
                friends.denyRequest(req.session.user.id, req.body.id)
                .then((results) => {
                    res.json({

                    })
                })
            } else if (req.body.status===3 && req.body.initiator===1) { // INITIATOR HAS ALREADY BEEN DENIED, THIS SHOULD NEVER HAPPEN / RESULT IN A SPECIAL MESSAGE
                res.json({
                    success: false,
                    error: "not allowed"
                })
            } else if (req.body.status===3 && req.body.initiator===2) {  // INITIAL REQUEST WAS DENIED BY RECEIVER, HOWEVER RECEIVER MAY MAKE NEW REQUEST
                friends.makeRequest(req.session.user.id, req.body.id)
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
                friends.makeRequest(req.session.user.id, req.body.id)
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
                // friends.makeRequest(req.session.user.id, req.body.id)
                // .then((results) => {
                //     if (results.rows[0]) {
                //         res.json({
                //             success: true,
                //             friendRequestStatus: results.rows[0].status_code,
                //             friendRequestInitiator: 1
                //         })
                //     }
                // })
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

app.get('/welcome', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.get('*', function(req, res) {
    if(!req.session.user) {
        res.redirect('/welcome');
    } else {
    res.sendFile(__dirname + '/index.html');
    }
});

app.post('/login', (req, res) => {
    user.login(req.body)
    .then((results) => {
        req.session.user = {
            id: results.rows[0].id
        }
        if (results) {
            res.json({
                success: true,
                results: results.rows[0]
            })
        }
        else {}
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/register', user.checkRegister, (req, res) => {
    user.register(req.body)
    .then((results) => {
        if (results) {
            req.session.user = {
                id: results.rows[0].id
            }
            res.json({
                success: true,
                results: results.rows[0]
            })
        }
        else {}
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/PPupload', uploader.single('file'), function(req, res) {
    var userid = req.session.user.id;

    if (req.file) {
        let s3Request = client.put("/pics/" + req.file.filename, {
            'Content-Type': req.file.mimetype,
            'Content-Length': req.file.size,
            'x-amz-acl': 'public-read'
        });

        let readStream = fs.createReadStream(req.file.path);
        readStream.pipe(s3Request);
        s3Request.on('response', s3Response => {
            let success = s3Response.statusCode == 200;
            db.query(
                `UPDATE users SET pic_url = $1 WHERE id = $2 RETURNING *`, [req.file.filename, userid])
                .then((results) => {
                    let imgUrl = config.s3Url.concat(results.rows[0].pic_url);
                    res.json({
                        success: true,
                        imgUrl: imgUrl
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
    }
});

app.post('/BioUpload', function(req, res) {
    var userid = req.session.user.id;
    db.query(
        `UPDATE users SET bio = $1 WHERE id = $2 RETURNING *`, [req.body.bio, userid])
        .then((results) => {
            res.json({
                success: true,
                newBio: results.rows[0].bio
            });
        })
        .catch((err) => {
            console.log(err);
        })
});



app.listen(8080, function() {
    console.log("I'm listening.");
});
