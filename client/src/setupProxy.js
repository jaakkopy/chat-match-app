const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true
        })
    );

    // Does not work yet
    app.use(
        '/chat',
        createProxyMiddleware({
            target: 'ws://localhost:8000',
            ws: true,
            changeOrigin: true
        })
    );
};
