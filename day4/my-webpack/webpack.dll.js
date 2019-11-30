const path = require('path')
const webpack = require('webpck')

module.exports = {
	entry: {
		library: [
			'react',
			'react-dom'
		]
	},
	output: {
		filename: '[name]_[chunkhash].dll.js',
		path: path.join(__dirname, 'build/library'),
		library: '[name]'
	},
	plguins: [
		new webpack.DllPlugin({
			name: '[name]_[hash]',
			path: path.join(__dirname, 'build/library/[name].json')
		})
	]
}