export interface User {
    email: string;
    profiletext: string;
    fullname: string;
    birthdate: Date;
}

export interface UserProfileUpdateFields {
    profiletext: string;
}