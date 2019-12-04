#! /usr/bin/env node
// 声明用node启动


let path = require('path')

// config 配置文件
let config = require(path.resolve('webpack.config,js'))

let Compiler = require('../lib/Compiler.js')

let compiler = new Complier(config)

compiler.hooks.entryOption.call() // 运行钩子

compiler.run()
