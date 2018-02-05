let spicedPg = require('spiced-pg');

let dbUrl = process.env.DATABASE_URL || `postgres:${require('../secrets').dbUser}@localhost:5432/network`;

let db = spicedPg(dbUrl);

let bcrypt = require('bcryptjs');


exports.checkRegister = (req, res, next) => {
    let {first, last, email, pass1, pass2} = req.body;
    let holdEmail = email;
    if (!email.length > 0 || email.indexOf(" ") >= 0 || email.split("@").length !== 2) {
        res.json({
            error: 1
        }).end();
    } else if (!pass1.length > 0 || pass1.indexOf(" ") >= 0 || pass1 !== pass2)  {
        res.json({
            error: 2
        }).end();
    } else {
        email = holdEmail;
        next();
    }
}

exports.register = ({first, last, email, pass1}) => {
    return exports.hashPassword(pass1)
        .then((hash) => {
            return db.query(
            `INSERT INTO users (first, last, email, hashpass) VALUES ($1, $2, $3, $4) RETURNING *`, [first, last, email, hash])
        })
}

exports.checkLogin = (req, res, next) => {
    let {email, pass} = req.body;
    if (!email.length > 0 || email.indexOf(" ") >= 0 || email.split("@").length !== 2) {
        res.json({
            error: 0
        }).end();
    } else if (!(pass.length > 0)) {
        res.json({
            error: 1
        }).end();
    } else {
        next();
    }
}
exports.login = ({email, pass}) => {
    return db.query(
        `SELECT hashpass FROM users WHERE email = $1`, [email]
    )
    .then((result) => {
        return exports.checkPassword(pass, result.rows[0].hashpass)
    })
    .then((match) => {
        if (match) {
            return db.query(
                `SELECT * FROM users WHERE email = $1`, [email]
            )
            .then((results) => {
                return results;
            })
        } else {
            throw new Error ("passwords do not match.");
        }
    })
}

exports.profile = (id) => {
    return db.query(
        `SELECT * FROM users WHERE id = $1`, [id]
    )
}

exports.hashPassword = (plainTextPassword) => {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

exports.checkPassword = (textEnteredInLoginForm, hashedPasswordFromDatabase) => {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}
