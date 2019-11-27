'use strict'

const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'), // 文件夹
		filename: 'bundle.js'
	},
	mode: 'production'
}