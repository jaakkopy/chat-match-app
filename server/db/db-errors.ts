import { DatabaseError } from 'pg';
import { DBErrors } from '../models/db-interface';

// Return true if the given error is a unique constraint error
const isUniqueConstraintError = (e: any) => {
    return e instanceof DatabaseError && e.code == "23505";
}

// Return true if the given error is a null constraint error
const isNullConstraintError = (e: any) => {
    return e instanceof DatabaseError && e.code == '23502';
}

const errors: DBErrors = {
    isUniqueConstraintError,
    isNullConstraintError
}

export default errors;
