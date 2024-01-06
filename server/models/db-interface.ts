export interface DB {
    query: (queryText: string, parameters?: any[]) => Promise<any[]>
}
