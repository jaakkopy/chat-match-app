CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL
);

CREATE TABLE likes (
    liker INT NOT NULL,
    liked INT NOT NULL,
    PRIMARY KEY(liker, liked),
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
    PRIMARY KEY(disliker, disliked),
    CONSTRAINT fk_disliker
        FOREIGN KEY(disliker)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_disliked 
        FOREIGN KEY(disliked)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- This function will delete an existing like when adding a dislike to prevent both from existing at the same time
CREATE FUNCTION check_like_when_disliking() RETURNS TRIGGER AS
$$
BEGIN
    IF ((SELECT COUNT(*) FROM (SELECT liker FROM likes WHERE (liker=NEW.disliker AND liked=NEW.disliked))) > 0) THEN
        DELETE FROM likes WHERE (liker=NEW.disliker AND liked=NEW.disliked);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This function will delete an existing dislike when adding a like to prevent both from existing at the same time
CREATE FUNCTION check_dislike_when_liking() RETURNS TRIGGER AS
$$
BEGIN
    IF ((SELECT COUNT(*) FROM (SELECT disliker FROM dislikes WHERE (disliker=NEW.liker AND disliked=NEW.liked))) > 0) THEN
        DELETE FROM dislikes WHERE (disliker=NEW.liker AND disliked=NEW.liked);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the triggers
CREATE TRIGGER check_like_when_disliking BEFORE INSERT ON dislikes FOR EACH ROW EXECUTE PROCEDURE check_like_when_disliking();
CREATE TRIGGER check_dislike_when_liking BEFORE INSERT ON likes FOR EACH ROW EXECUTE PROCEDURE check_dislike_when_liking();
