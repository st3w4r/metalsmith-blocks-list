'use strict'

var fs = require('fs');
var path = require('path');
var async = require('async');

/**
 * Expose `Plugin`
 */

 module.exports = plugin;

/**
	* A Metalsmith plugin to ordering blocs and build page
	*
	* @param {Object} Options
	*
*/

function plugin(opts) {

	//Init options
	opts = opts || {};
	opts.directory = opts.directory || 'lists';
	opts.ext = opts.ext || '.list';

	return function(files, metalsmith, done){

		function filterFile(file) {
			var correctExtansion = path.extname(file) === opts.ext;
			var hasBlocs = files[file].blocs;
			if (correctExtansion && hasBlocs)
				return true;
			return false;
		}

		var listFiles = Object.keys(files);
		var filtredListFiles = listFiles.filter(filterFile);

		async.each(filtredListFiles, (item, callback) => {
			var blocsPath = files[item].blocs.map((item) =>{
				return path.join(metalsmith.path(opts.directory), item);
			});

			var buffer;
			var arrBuffers = [];
			var bufferTotalLength = 0;

			async.each(blocsPath, (filePath, callback) => {
				// fs.readFile(filePath, (err, data) => {
				// 	if (err) console.log('Error: ', err);
				// 	bufferTotalLength += data.length;
				// 	arrBuffers.push(data);
				// 	callback();
				// });
				var data = fs.readFileSync(filePath);
				bufferTotalLength += data.length;
				arrBuffers.push(data);
				callback();
			}, (err, done) => {
				if (err) console.log('Error Buffer: ', err);
				buffer = Buffer.concat(arrBuffers, bufferTotalLength);
				files[item].contents = buffer;
				console.log(files[item]);
				callback();
			});
		}, (err, callback) => {
			if (err) console.log('Error: ', err);
			done();
		});
	};
}

// Helper
function readBlocs(blocsDir, metalsmith, done) {
	var path = metalsmith.path(blocsDir);
	fs.readdir(path, (err, data) => {
		if (err) throw err;
		done(null, data);
	});
}
