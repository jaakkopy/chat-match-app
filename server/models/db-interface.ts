export interface DBErrors {
    isUniqueConstraintError: (exception: any) => boolean;
    isNullConstraintError: (exception: any) => boolean;
}

export interface DB {
    query: (queryText: string, parameters?: any[]) => Promise<any[]>;
    errors: DBErrors;
}
