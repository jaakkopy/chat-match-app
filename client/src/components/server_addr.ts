// Functions for creating the correct url based on environment variables

export const getServerAddr = () => {
    return `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_SERVER_HOST}`;
}

export const getWsServerAddr = () => {
    return `ws://${process.env.REACT_APP_SERVER_HOST}`;
}