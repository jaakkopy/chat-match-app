import ServiceResult from "../models/service-result"

/*
Convenience functions for returning common service results
*/

export const defaultServiceResult = (data?: any): ServiceResult => {
    return {
        ok: true,
        status: 200,
        msg: 'ok',
        data: data
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