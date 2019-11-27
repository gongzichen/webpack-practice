'use strict'

const glob = require('glob') // 查找文件目录、 文件
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')  // html 配置
const CleanWebpackPlugin = require('clean-webpack-plugin') // dist 清理插件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')  // webpack友好提示插件

const setMPA = () => {
	const entry = {}
	const HtmlWebpackPlugins = []
	const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
	console.log(entryFiles, '===读取文件')
	Object.keys(entryFiles)
		.map(index => {
			const entryFile = entryFiles[index]
			console.log(index,'==index')
			const match = entryFile.match(/src\/(.*)\/index\.js/)
			const pageName = match && match[1]

			entry[pageName] = entryFile
			HtmlWebpackPlugins.push(
				HtmlWebpackPlugin({
					template: path.join(__dirname, `src/${pageName}/index.html`),
					fileName: `${pageName}.html`,
					chunks: [pageName],
					inject: true,
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
	return { entry, HtmlWebpackPlugins }	
}

const { entry, HtmlWebpackPlugins } = setMPA()  

module.exports = {
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		fileName: '[name].js'
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
						loader: 'url-loader', // 内部封装 file-loader
						options: {
							limit: 10240 // 小于10240 转成base64
						}
					}
				]
			},
			{
				test: /.(woff|woff2|eot|ttf|otf)$/, 
				options: 'file-loader'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin()
	].concat(HtmlWebpackPlugins),
	devServer: {
		contentBase: './dist',
		hot: true,
		status: 'errors-only'
	},
	devetool: 'cheap-source-map'
}
