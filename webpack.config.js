const path = require('path');

module.exports = {
    entry: {
        'test': './test/index.js'
    },
    output: {
        path: path.join(__dirname, 'test', 'dist'),
        filename: '[name].js',
        library: 'template',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.art$/,
            use: [{
                loader: 'art-template-loader',
                options: {
                    compressor: source => {
                        return source
                            .replace(/\s+/g, ` `)
                            .replace(/<!--[\w\W]*?-->/g, ``);
                    }
                }
            }]
        }]
    }
};