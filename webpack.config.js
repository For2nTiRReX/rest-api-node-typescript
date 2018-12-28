const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
    context: path.resolve('./src'),
    target: 'node',
    entry: path.resolve('./src', 'server.ts'),
    output: {
        path: path.resolve('./dist'),
        filename: 'server.js',
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: [path.resolve('./src'), 'node_modules'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    plugins: [
        new NodemonPlugin(),
    ],
};