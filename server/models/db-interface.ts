export interface DBErrors {
    isUniqueConstraintError: (exception: any) => boolean;
    isNullConstraintError: (exception: any) => boolean;
}

export type DBRows = any[];

export interface DBLikes {
    insertLike: (likerEmail: string, likedEmail: string) => Promise<DBRows>;
    insertDislike: (dislikerEmail: string, dislikedEmail: string) => Promise<DBRows>;
}

export interface DBUsers {
    insertUser: (email: string, hashedPw: string) => Promise<DBRows>;
    getUserByEmail: (email: string) => Promise<DBRows>;
}

export interface DB {
    likes: DBLikes;
    users: DBUsers;
    errors: DBErrors;
}
