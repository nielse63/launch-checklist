
'use strict';

// modules
const site = require('../models/site');
const utils = require('../utils');
const blc = require('broken-link-checker');

// classes
const TestSuite = require('./test-suite');

class BrokenLinks extends TestSuite {

	constructor() {
		super();

		this.name = 'Broken Links';
		this.description = 'Searches for broken links on the website';
		this.index = 4;

		this.addTests();
	}

	addTests() {

		function fetchLinks(callback) {

			const _site = site.toJSON();
			const output = [];
			let hasBroken = false;
			const htmlChecker = new blc.HtmlChecker({
				filterLevel          : 0,
				honorRobotExclusions : false
			}, {
				link(result){
					const object = {
						broken : false,
						status : result.http.response.statusCode,
						url    : result.url.original
					};

					if (result.broken) {
						object.broken = true
						hasBroken = true
						object.status = blc[result.brokenReason];
					} else if (result.excluded) {
						object.broken = true
						hasBroken = true
						object.status = blc[result.excludedReason];
					}

					output.push(object);

					if( ! htmlChecker.numQueuedLinks() ) {
						return callback(output, hasBroken);
					}
				},
				complete() {
					callback(output, hasBroken)
				}
			});

			htmlChecker.scan(_site.html.raw, _site.baseurl);
		}

		this.tests = [{
			name        : 'Broken Links',
			description : 'Checking for broken links',
			test() {
				return new Promise((resolve, reject) => {
					fetchLinks((data, hasBroken) => {
						if( hasBroken ) {
							return reject(data);
						}
						resolve(data);
					})
				}).catch(err => {
					utils.error(err);
				});
			},
			format() {
				return [{
					headers : {
						url    : 'URL',
						broken : 'Broken',
						status : 'Status Code'
					},
					values : this.results
				}];
			}
		}];
	}
}

module.exports = BrokenLinks;