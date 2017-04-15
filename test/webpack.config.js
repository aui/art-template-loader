const path = require('path');

module.exports = {
    entry: {
        'test': path.join(__dirname, 'index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: 'template',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.art$/,
            use: [{
                loader: require.resolve('../'),
                options: {
                    root: path.resolve(__dirname, 'res'),
                    imports: require.resolve('./template-imports'),
                    compressor: source => {
                        return source
                            // remove newline / carriage return
                            .replace(/\n/g, "")

                            // remove whitespace (space and tabs) before tags
                            .replace(/[\t ]+\</g, "<")

                            // remove whitespace between tags
                            .replace(/\>[\t ]+\</g, "><")

                            // remove whitespace after tags
                            .replace(/\>[\t ]+$/g, ">")
                            
                            // remove comments
                            .replace(/<!--[\w\W]*?-->/g, "");
                    }
                }
            }]
        }]
    }
};