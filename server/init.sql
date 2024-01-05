CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL
);

CREATE TABLE likes (
    liker INT NOT NULL,
    liked INT NOT NULL,
    CONSTRAINT fk_liker
        FOREIGN KEY(liker)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_liked 
        FOREIGN KEY(liked)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE dislikes (
    disliker INT NOT NULL,
    disliked INT NOT NULL,
    CONSTRAINT fk_disliker
        FOREIGN KEY(disliker)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_disliked 
        FOREIGN KEY(disliked)
        REFERENCES users(id)
        ON DELETE CASCADE
);
