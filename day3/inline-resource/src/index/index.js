import { helloworld } from './helloworld';

document.write(helloworld());


// 开启热更新替换 存在 module.hot
if (module.hot) {
	module.hot.accept('./helloworld.js', function () { //告诉 webpack 接受热替换的模块
		console.log('Accepting the updated printMe module!');
		document.write(helloworld());
	})
}