
// modules
const curl = require('curlrequest');

// models
const site = require('../models/site');

// classes
const TestSuite = require('./test-suite');

class Performance extends TestSuite {

	constructor() {
		super();

		this.name = 'Performance';
		this.description = 'Gets information about site performance.';
		this.addTests();
	}

	addTests() {

		this.tests = [{
			name : 'PageSpeed',
			description : 'Checking page speed',
			test : function() {
				const url = encodeURIComponent( site.toJSON().site.siteurl );
				const strategy = 'desktop';
				const get = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=' + url + '&screenshot=false&strategy=' + strategy + '&key=AIzaSyBwB5pCLn_6i0QtDqqly_CmrO-Oe42daTg';
				return new Promise(function(resolve, reject) {
					curl.request(get, function(err, stdout) {
						if( err ) {
							return reject(err);
						}

						const output = JSON.parse(stdout);
						if( output.error ) {
							return reject( output.error.message );
						}

						const score = output.ruleGroups.SPEED.score;
						if( score < 85 ) {
							return reject( output );
						}

						resolve( output );
					});
				}).catch(err => {
					reject(err);
				});
			},
		}];
	}
}

module.exports = Performance;