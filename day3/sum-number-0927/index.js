if (process.env.NODE_ENV === 'production') {
	module.exports = require('./dist/sum-number.min.js');
} else {
	module.exports = require('./dist/sum-number.js');
}
