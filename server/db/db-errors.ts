import { DatabaseError } from 'pg';
import { DBErrors } from '../models/db-interface';

const isUniqueConstraintError = (e: any) => {
    return e instanceof DatabaseError && e.code == "23505";
}

const isNullConstraintError = (e: any) => {
    return e instanceof DatabaseError && e.code == '23502';
}

const errors: DBErrors = {
    isUniqueConstraintError,
    isNullConstraintError
}

export default errors;
