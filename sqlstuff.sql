DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100) NOT NULL,
    last VARCHAR(100) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    hashpass VARCHAR(320) NOT NULL,
    bio VARCHAR(5000),
    pic_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--
-- CREATE TABLE images(
--     id SERIAL PRIMARY KEY,
--     image VARCHAR(300) NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     username VARCHAR(100) REFERENCES users(username) NOT NULL,
--     description TEXT,
--     hashtags VARCHAR(1000),
--     user_id INTEGER REFERENCES users(id) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- CREATE TABLE comments(
--     id SERIAL PRIMARY KEY,
--     message VARCHAR(1000) NOT NULL,
--     username VARCHAR(100) REFERENCES users(username) NOT NULL,
--     user_id INTEGER REFERENCES users(id) NOT NULL,
--     image_id INTEGER REFERENCES images(id) NOT NULL,
--     hashtags VARCHAR(1000),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
