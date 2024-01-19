export default interface ServiceResult {
    ok: boolean;
    status: number;
    msg: string;
    data?: any;
}