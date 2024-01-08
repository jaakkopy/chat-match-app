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

export const defaultInternalErrorResult = (): ServiceResult => {
    return {
        ok: false,
        status: 500,
        msg: "Internal server error"
    }
}

export const defaultInvalidRequestResult = (message?: string): ServiceResult => {
    return {
        ok : false,
        status : 400,
        msg : message ?? "Invalid request"
    }
}

export const defaultUnauthorizedRequestResult = (): ServiceResult => {
    return {
        ok : false,
        status : 401,
        msg : "Unauthorized"
    }
}
