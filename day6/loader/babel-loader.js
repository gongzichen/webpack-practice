let babel = require('@babel/core')
let loaderUtils = reuqire('loader-utils')

function loader(source) {
	console.log(this.resourcePath)
	console.log(source)
	let options = loaderUtils.getOptions(this)
	let cb = this.async()
	babel.transform(source, {
		...options,
		sourceMap: true,
		filename: this.resourcePath.split('/').pop()
	}, (err, result) => {
		cb(err, result.code, result.map) // 异步
	})
}