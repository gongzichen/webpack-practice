'use strict'

const glob = require('glob') // 路径匹配
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const setMPA = () => {
	const entry = {}
	const HtmlWebpackPlugins = []
	const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

	Object.keys(entryFiles).map( idx => {
		const entryFile = entryFiles[idx]
		const match = entryFile.match(/src\/(.*)/.js)
		const pageName = match && match[1]

		entry[pageName] = entryFile
		HtmlWebpackPlugins.push(
			new HtmlWebpackPlugin({
				template: path.join(__dirname, `src/${match}/index.html`),
				filename: `${pageName}.html`,
				chunks: true,
				inject: true, // 是否将js.css 插入htmk true: 插入body底部
				minify: {
					html5: true,
					collapseWhitespace: true,
					preserveLineBreaks: false,
					minifyCSS: true,
					minifyJS: true,
					removeComments: false
				}
			})
		)
	})
	return {
		entry,
		HtmlWebpackPlugins
	}
}

const {entry, HtmlWebpackPlugins} = setMPA()

module.exports = {
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /.js$/,
				use: 'babel-loader'
			},
			{
				test: /.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /.less$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /.(png|jpg|gif|jpeg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10240
						}
					}
				]
			},
			{
				test: /.(woff|woff2|eot|ttf|otf)$/,
				use: 'file-loader'
			}
		]
	},
	plguins: [
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin()
	].concat(HtmlWebpackPlugins),
	devServer: {
		contentBase: './dist',
		hot: true,
		state: 'errors-only'
	},
	devtool: 'cheap-source-map'
}