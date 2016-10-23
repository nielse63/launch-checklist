
const path = require('path');
const fs = require('fs');

let docroot;

function getWPConfig(dir) {
	"use strict";

	const configPath = path.join( dir, 'wp-config.php' );
	if( fs.existsSync( configPath ) ) {
		return configPath;
	}
	return '';
}

function getDocRoot() {
	"use strict";

	let cwd = process.cwd();
	const sep = path.sep;
	let pathArray = cwd.split(sep);

	pathArray.forEach(function() {
		cwd = pathArray.join( sep );
		if( getWPConfig( cwd ) ) {
			docroot = cwd;
			return false;
		}
		pathArray.pop();
	});

	return cwd;
}

module.exports = exports = {
	url : '',
	cwd : process.cwd(),
	docroot : getDocRoot(),
	'wp-config' : getWPConfig( docroot ? docroot : getDocRoot() ),
	test : ['info', 'plugins', 'broken-links', 'performance', 'security', 'seo', 'valid-html'],
};