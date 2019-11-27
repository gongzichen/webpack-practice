const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: {
		'sum-number': './src/index.js',
		'sum-number.min': './src/index.js'
	},
	output: {
		filename: '[name].js',
		library: 'sumNumber',
		libraryTarget: 'umd',
		libraryExport: 'default',
		globalObject: "this"  // 默认是window
	},
	mode: 'none',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				include: /\.min\.js$/,
			})
		]
	}

}