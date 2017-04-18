const path = require('path');

module.exports = {
    entry: {
        'include': path.join(__dirname, 'include', 'index.js'),
        'layout': path.join(__dirname, 'layout', 'index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: 'template',
        libraryTarget: 'commonjs2'
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