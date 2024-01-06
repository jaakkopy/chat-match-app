import { DatabaseError } from 'pg';

const isUniqueConstraintError = (e: any) => {
    return e instanceof DatabaseError && e.code == "23505";
}

const isNullConstraintError = (e: any) => {
    return e instanceof DatabaseError && e.code == '23502';
}

const dbErrors = {
    isUniqueConstraintError,
    isNullConstraintError
}

export default dbErrors;
