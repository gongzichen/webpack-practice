'use strict'

const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS提取为独立的文件的插件.支持按需加载css和sourceMap
const OptmizeCSSAssetsPlugin = require('optimize-css-assets-webpacl-plguin') // css压缩文件 1.普通压缩 2.cssnano压缩配置
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')  // 抽取公共资源
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin') // 整理打包信息

const setMPA = () => {
	const entry = {}
	const HtmlWebpackPlugins = []
	const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

	Object.keys(entryFiles).map( idx => {
		const entryFile = entryFiles[idx]

		const match = entryFile.match(/src\/(.*)\/index\.js$/)
		const pageName = match && match[1]
		
		entry[pageName] = entryFile

		HtmlWebpackPlugins.push(
			new HtmlWebpackPlugin({
				template: path.join(__dirname, `src/${pageName}/index.html`),
				filename: `${pageName}.html`,
				chunks: ['vendors', pageName],
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
		filename: '[name]_[chunkhash:8].js'
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /.js$/,
				use: [
					'babel-loader'
				]
			},
			{
				test: /.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /.less/,
				use: [
					MiniCssExtractPlugin.logaer,
					'css-laoder',
					'less-loader',
					{
						loader: 'postcss-laoder',
						options: {
							plugins: () => {
								require: () => {
									require('autoprefixer')({
										overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
										// ****** 接口更新  browsers => overrideBrowserslist
									})
								}
							}
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
							name: '[name]_[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plguins: [
		new MiniCssExtractPlugin({
			filename: '[name]_[contenthash:8].css'
		}),
		new OptmizeCSSAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano')
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackExternalsPlugin({
			exterals: [
				{
					module: 'react',
					entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
					global: 'React',
				},
				{
					module: 'react-dom',
					entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
					global: 'ReactDOM'
				}
			]
		}),
		new FriendlyErrorsWebpackPlugin(),
	  	function () {
	  	this.hooks.done.tap('done', (stats) => {
	  		if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
	  			console.log('错误上报');
	  			process.exit(1); // 非 0 表示失败
	  		}
	  	})
	  }
	].concat(HtmlWebpackPlugins),
	stats: 'errors-only'
}