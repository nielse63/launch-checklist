
// modules
// var loader = require('cli-loader')();

// internal modules
const utils = require( '../utils' );
const Test = require('./test');
const events = require('../events');

class TestSuite {

	constructor() {
		this.name = '';
		this.description = '';
		this.tests = [];
	}

	beforeRun() {
		events.emit('suite:start', this.name);

		utils.info([
			'',
			`Running '${this.name}' suite`,
			'='.repeat(50),
		].join('\n'));
		this.startTime = Date.now();
		// loader.start();
	}

	afterRun(output) {
		// loader.stop();
		this.output = output;
		this.stopTime = Date.now();
	}

	run() {

		if( ! this.tests.length ) {
			return utils.warn(`No tests available for ${this.name}`);
		}

		this.beforeRun();

		let count = this.tests.length;
		let output = [];

		function cb(name, data) {
			output.push({
				name : name,
				data : data,
			});
			count--;
			if( ! count ) {
				this.afterRun(output);
			}
		}

		this.tests.forEach(object => {
			const name = object.name;
			var test = new Test(object);
			test.run().then(values => {
				cb.call(this, name, values);
			}).catch(err => {
				cb.call(this, name, err);
			});
		});
	}
}

module.exports = TestSuite;