'use strict'

const glob = require('glob') // 文件读取 查询
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS提取为独立的文件的插件.支持按需加载css和sourceMap
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // css压缩文件 1.普通压缩 2.cssnano压缩配置
const HtmlWebpackPlugin = require('html-webpack-plugin') //html 配置 压缩 删除空格 冒号等等  https://www.jianshu.com/p/08a60756ffda
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清空dist
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin') // 抽取公共资源 有异步  (SplitChunksPlugin 无异步)
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin') // 识别webpack 错误 聚合-优先级 提供

const setMPA = () => {
	const entry = {}
	const htmlWebpackPlugins = []
	const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
	Object.keys(entryFiles).map(idx => {
		const entryFile  = entryFiles[idx]
		const match = entryFiles.match(/src\/(.*)index-server\.js$/)
		const pageName = match && match[1]

		if (pageName) {
			entry[pageName] = entryFile
			htmlWebpackPlugins.push(
				new HtmlWebpackPlugin({
					template: path.join(__dirname, `src/${pageName}/index.html`),
					filename: `${pageName}.html`,
					chunks: ['vendors', pageName],
					inject: true,
					minify: {
						html5: true,
						collapseWhitespace: true,
						preserveLineBreaks: false,
						minifyJS: true,
						minifyCSS: true,
						removeComments: false // 是否带注释
					}
				})
			)
		}
	})
	return {
		entry,
		htmlWebpackPlugins
	}
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]-server.js',
		libraryTarget: 'umd'
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /.js$/,
				use: ['babel-loader']
			},
			{
				test: /.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
				]
			},
			{
				test: /.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'less-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								require('autoprefixer')({
									overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
									// ****** 接口更新  browsers => overrideBrowserslist
								})
							]
						}
					},
					{
						loader: 'px2rem-loader',
						options: {
							remUnit: 75,
							remPreision: 10
						}
					}
				]
			},
			{
				test: /.(png|jpg|gif|jpeg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8].[ext]'
						}
					}
				]
			},
			{
				test: /.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8][ext]'
						}
					}
				]
			}
		
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]_[contenthash:8].css'
		}),
		new OptimizeCSSAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano')
		}),
		new CleanWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin(),
		function () {
			this.hooks.done.tap('done', stats => {
				 if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
				 	console.log('错误上报');
				 	process.exit(1);
				 }
			})
		}
	].concat(htmlWebpackPlugins),
	stats: 'errors-only'
}

