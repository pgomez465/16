var path = require('path');

module.exports = {
	entry: {
		index: './client/js/index'
	},
	output: {
		path: path.join(__dirname, 'static', 'js'),
		filename: '[name].js',
		chunkFilename: '[name].js',
		publicPath: '/js/',
		pathinfo: true				// Remove in production
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	debug: true,
	devtool: 'source-map'
};
