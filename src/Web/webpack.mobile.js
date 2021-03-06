const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: "development",
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        disableHostCheck: true,
    },
});