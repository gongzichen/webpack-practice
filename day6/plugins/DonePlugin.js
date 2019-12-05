class DonePlugin {
	apply(compiler) {
		console.log(1)
		compiler.hook.done.tap('DonePlugin', (state)=> {
			console.log('state==z注册钩子函数', state)
			console.log('处理逻辑~')
		})
	}
}

module.exports = DonePlugin