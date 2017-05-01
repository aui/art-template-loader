const path = require('path');

module.exports = {
	entry: {
		'include': path.join(__dirname, 'include', 'index.js'),
		'layout': path.join(__dirname, 'layout', 'index.js')
	},
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		library: 'template',
		libraryTarget: 'umd'
	},
	module: {
		rules: [{
			test: /\.(jpg|png|gif)$/i,
			use: ['file-loader']
		}, {
			test: /\.art$/,
			use: [{
				loader: require.resolve('../'),
				options: {
					root: path.resolve(__dirname),
					imports: require.resolve('./template-runtime')
				}
			}]
		}]
	}
};
