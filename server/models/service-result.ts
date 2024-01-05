export interface ServiceResult {
    ok: boolean;
    status: number;
    msg: string;
    data?: any;
}

export const defaultServiceResult = (): ServiceResult => {
    return {
        ok: true,
        status: 200,
        msg: 'ok'
    }
}
