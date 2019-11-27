import { helloworld } from './helloworld'
import '../../common' // import 引入

document.write(helloworld())

// 入口文件接受热跟新  (热跟新替换api)
if (module.hot) {
	module.hot.accept('./helloworld.js', () => { // 告诉webpack 接受热替换的模块
		console.log('Accepting the updated printMe module!');
		document.write(helloworld())
	})
}