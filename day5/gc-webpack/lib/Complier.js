let fs = require('fs')
let path = require('path')
let babylon = require('babylon') // 将源码转为ast
let t = require('@babel/types') 
let traverse = require('@babel/traverse').default 
let generator = require('@babel/generator').default 
let ejs = require('ejs')

let {SyncHook} = require('tapable')

class Compiler {
	constructor(config) {
		this.config = config;
		this.entryId;  // ./src/index.js
		this.modules = {} //保存所有模块
		this.entry = config.entry // 入口
		this.root = process.cwd() // 工作路径

		this.hooks = {   // 注册钩子
			entryOption: new SyncHook(),
			compile: new SyncHook(),
			afterCompile: new SyncHook(),
			afterPulgins: new SyncHook(),
			run: new SyncHook(),
			emit: new SyncHook(),
			done: new SyncHook()
		}

		let plugins = this.config.plugins
		if (Array.isArray(plugins)) {
			plugins.forEach(plugin => {
				plugin.apply(this)  // 执行所有的插件
			})
		}
		this.hooks.afterPulgins.call()
	}
	getSource(modulePath) {
		let rules = this.config.module.rules
		let content = fs.readFileSync(modulePath, 'utf8') // 读取配置文件
		console.log(content, '===config配置=')
		for (let i = 0; i < rules.length; i++) {
			let rule = rules[i]
			let { test, use } = rule // 处理loader
			let len = use.length - 1
			if (test.test(modulePath)) { // 要通过loader 处理的文件路径
				function normalLoader () {
					let loader = require(use[len--]) // 依次加载loader
					content = loader(content)
					if (len > 0) {   // 依次处理loader
						normalLoader()
					}
				}
			}
		}
		return content	
	}
	// 解析源码 
	parse(source, parentPath) { // AST解析
		let ast = babylon.parse(source) 
		let dependencies = [] // 依赖的数组
		console.log(ast, '===解析成ast')
		traverse(ast, {
			CallExpression(p) {
				let node = p.node // 对应的接点
				console.log(node, '===对应的节点')
				if (node.callee.name === 'require') {
					node.callee.name = '__webpack_require__' // require => __webpack_require__
					let modlueName = node.arguments[0].value // 取得模块的引用名
					modlueName = modlueName + (path.extname(modlueName)).value // 取得模块的引用名
					modlueName = './' + path.join(parentPath, moduleName) ? '' : '.js'
					dependencies.push(moduleName)
					node.arguments = [t.stringLiteral(moduleName)]
				}
			}
		})
		let sourceCode = generator(ast).code
		return { sourceCode, dependencies }
	}
	// 构建模块
	buildModule(modulePath, isEntry) {
		// 拿到模块内容
		let source = this.getSource(modulePath)
		let moduleName = './' + path.relative(this.root, modulePath) // 模块 modulePath = modulePath - this.root src/index.js
		if (isEntry) {
			this.entryId = moduleName // 保存入口的名称
		}
		
		// 解析需要改造的源码
		let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) // ./src

		// 将source源码进行修改 对应
		this.modules[moduleName] = sourceCode  // 拿到源码 然后 加载loader

		dependencies.forEach(dep => {
			this.buildModule(path.join(this.root, dep), false) // 附模块的加载 递归加载
		})
	}
	// 弹射文件
	emitFile() {
		// 拿到需要输入的目录
		let main = path.join(this.config.output.path, this.config.output.filename)
		// 模块
		let templateStr = this.getSource(path.join(__dirname, 'main.js'))
		let code = ejs.render(templateStr, {
			entryId: this.entryId,
			modules: this.modules
		})
		this.assets = {}
		this.assets[main] = code
		fs.writeFileSync(main, this.assets[main]) // 写文件
	}
	run() {
		this.hooks.run.call()
		// 执行 创建文件的依赖关系
		this.hooks.compile.call() 
		this.buildModule(path.resolve(this.root, this.entry), true)
		this.hooks.afterCompile.call()
		// 发射文件
		this.emitFile()
		this.hooks.emit.call()
		this.hooks.done.call()
	}
}

modules.exports = Compiler