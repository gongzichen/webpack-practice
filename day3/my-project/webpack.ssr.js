'use strict'

const glob = require('glob') // 文件读取 查询
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS提取为独立的文件的插件.支持按需加载css和sourceMap
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // css压缩文件 1.普通压缩 2.cssnano压缩配置
const HtmlWebpackPlugin = require('html-webpack-plugin') //html 配置 压缩 删除空格 冒号等等  https://www.jianshu.com/p/08a60756ffda
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清空dist
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin') // 抽取公共资源 有异步  (SplitChunksPlugin 无异步)
const FriendlyErrorsWebpack = require('friendly-errors-webpack-plugin') // 识别webpack 错误 聚合-优先级 提供


const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin') // 打包速度测量
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin') // 打包缓存


// webpack 优化 根绝mode 来显示
 // optimization: {
 //     splitChunks: {
 //         minSize: 0,
 //         cacheGroups: {
 //             commons: {
 //                 name: 'commons',
 //                 chunks: 'all',
 //                 minChunks: 2
 //             }
 //         }
 //     }
 // }