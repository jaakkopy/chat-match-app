export interface DBErrors {
    isUniqueConstraintError: (exception: any) => boolean;
    isNullConstraintError: (exception: any) => boolean;
}

export type DBRows = any[];

export interface DBLikes {
    insertLike: (likerEmail: string, likedEmail: string) => Promise<DBRows>;
    insertDislike: (dislikerEmail: string, dislikedEmail: string) => Promise<DBRows>;
    getLikedUsersOfUser: (email: string) => Promise<DBRows>;
    getDislikedUsersOfUser: (email: string) => Promise<DBRows>;
    verifyMutualLikes: (email1: string, email2: string) => Promise<boolean>;
    getMatchesOfUser: (email: string) => Promise<DBRows>;
}

export interface DBUsers {
    insertUser: (email: string, hashedPw: string) => Promise<DBRows>;
    getUserByEmail: (email: string) => Promise<DBRows>;
    getRandomUsersNotLikedOrDisliked: (email: string, amount: number) => Promise<DBRows>;
}

export interface DBMessages {
    insertMessage: (senderEmail: string, receiverEmail: string, content: string) => Promise<DBRows>;
    getMessages: (requesterEmail: string, targetUserEmail: string, batch: number) => Promise<DBRows>;
}

export interface DB {
    likes: DBLikes;
    users: DBUsers;
    errors: DBErrors;
    messages: DBMessages;
}
