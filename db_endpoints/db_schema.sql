DO $$
BEGIN
    CREATE TYPE channelTypesDto AS ENUM (
        'PUBLIC',
        'PROTECTED',
        'PRIVATE',
        'DIRECT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS User (
    id SERIAL PRIMARY KEY,
    fortytwo_id INT,
    pseudo VARCHAR(50),
    refresh_token VARCHAR(255),
    email VARCHAR(50),
    -- password VARCHAR(60),
    avatar VARCHAR(50),
    is2FActive BOOLEAN,
    secretOf2FA VARCHAR(60),
    xp FLOAT,
    ratio INT
);

CREATE TABLE IF NOT EXISTS Friend (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES User(id),
    followedUser_id INT REFERENCES User(id),
    isPending BOOLEAN
);

CREATE TABLE IF NOT EXISTS Match (
    id SERIAL PRIMARY KEY,
    userHome_id INT REFERENCES User(id),
    userForeign_id INT REFERENCES User(id),
    winner_id INT REFERENCES User(id),
    map VARCHAR(255),
    userHomeScore INT,
    userForeignScore INT,
    timestamp TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BlockedUser (
    blockingUser_id INT REFERENCES User(id),
    blockedUser_id INT REFERENCES User(id),
    PRIMARY KEY (blockingUser_id, blockedUser_id)
);

CREATE TABLE IF NOT EXISTS Channel (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES User(id),
    name VARCHAR(255),
    type channelTypesDto,
    password VARCHAR(255),
    creationDate TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Message (
    id SERIAL PRIMARY KEY,
    creator_id INT REFERENCES User(id),
    channel_id INT REFERENCES Channel(id),
    content TEXT,
    timestamp TIMESTAMP,
    modified TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ChannelAdmins (
    channel_id INT REFERENCES Channel(id),
    user_id INT REFERENCES User(id),
    PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS MutedUser (
    channel_id INT REFERENCES Channel(id),
    user_id INT REFERENCES User(id),
    until DATE,
    PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS BannedUser (
    channel_id INT REFERENCES Channel(id),
    user_id INT REFERENCES User(id),
    until DATE,
    PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS ChannelsUser (
    user_id INT REFERENCES User(id),
    channel_id INT REFERENCES Channel(id),
    PRIMARY KEY (user_id, channel_id)
);
