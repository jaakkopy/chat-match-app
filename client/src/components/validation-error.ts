// Defines the format of a validation error returned by the server
export default interface ValidationError {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
}