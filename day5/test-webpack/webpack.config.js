
let path = require('path')
module.exports = {
	mode: 'development',
	entry: './src/a.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}