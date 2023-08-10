CREATE TYPE channelTypesDto AS ENUM (
    'PUBLIC',
    'PROTECTED',
    'PRIVATE',
    'DIRECT'
);

CREATE TABLE User (
    id SERIAL PRIMARY KEY,
    fortytwo_id INT,
    pseudo VARCHAR(50),
    refresh_token VARCHAR(255),
    email VARCHAR(50),
    password VARCHAR(60),
    avatar VARCHAR(50),
    is2FActive BOOLEAN,
    secretOf2FA VARCHAR(60),
    xp FLOAT,
    ratio INT
);

CREATE TABLE Friend (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES User(id),
    followedUser_id INT REFERENCES User(id),
    isPending BOOLEAN
);

CREATE TABLE Match (
    id SERIAL PRIMARY KEY,
    userHome_id INT REFERENCES User(id),
    userForeign_id INT REFERENCES User(id),
    winner_id INT REFERENCES User(id),
    map VARCHAR(255),
    userHomeScore INT,
    userForeignScore INT,
    timestamp TIMESTAMP
);

CREATE TABLE BlockedUser (
    blockingUser_id INT PRIMARY KEY REFERENCES User(id),
    blockedUser_id INT PRIMARY KEY REFERENCES User(id)
);

CREATE TABLE Channel (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES User(id),
    name VARCHAR(255),
    type channelTypesDto,
    password VARCHAR(255),
    creationDate TIMESTAMP
);

CREATE TABLE Message (
    id SERIAL PRIMARY KEY,
    creator_id INT REFERENCES User(id),
    channel_id INT REFERENCES Channel(id),
    content TEXT,
    timestamp TIMESTAMP,
    modified TIMESTAMP
);

CREATE TABLE ChannelAdmins (
    channel_id INT PRIMARY KEY REFERENCES Channel(id),
    user_id INT PRIMARY KEY REFERENCES User(id)
);

CREATE TABLE MutedUser (
    channel_id INT PRIMARY KEY REFERENCES Channel(id),
    user_id INT PRIMARY KEY REFERENCES User(id),
    until DATE
);

CREATE TABLE BannedUser (
    channel_id INT PRIMARY KEY REFERENCES Channel(id),
    user_id INT PRIMARY KEY REFERENCES User(id),
    until DATE
);

CREATE TABLE ChannelsUser (
    user_id INT PRIMARY KEY REFERENCES User(id),
    channel_id INT PRIMARY KEY REFERENCES Channel(id)
);