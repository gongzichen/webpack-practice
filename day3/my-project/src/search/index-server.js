'use strict'

const React = require('react')
const largeNumber = require('large-number')
const logo = require('./images/logo.png')
const s = require('./search.less')

class Search extends React.component{

	constructor() {
		super(...arguments)

		this.state = {
			Text: null
		}
	}

	loadComponent() {
		import('./index.js').then(Text => {
			this.setState({
				Text: Text.default
			})
		})
	}

	render() {
		const { Text } = this.state;
		const addResult = largeNumber('999', '1')
		return <div className="search-text">
			{
				Text ? <Text /> : null
			}
			{ addResult }
			搜索文字的内容<img src={ logo } onClick={ this.loadComponent.bind(this) }/>>
		</div>
	}
}

module.exports = <Search/>