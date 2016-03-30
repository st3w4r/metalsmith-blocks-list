'use strict'

// var metalsmithConcat = require('metalsmith-concat');
var fs = require('fs');
var path = require('path');
// var Buffer = require('buffer');
// var matter = require('gray-matter');
var async = require('async');
// var concat = require('concat-files');



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

		// console.log(files);

		function filterFile(file) {
			// console.log(file);
			var correctExtansion = path.extname(file) === opts.ext;
			var hasBlocs = files[file].blocs;
			// console.log(correctExtansion);
			// console.log(hasBlocs);
			// console.log(correctExtansion && hasBlocs);
			if (correctExtansion && hasBlocs)
				return true;
			return false;
			// callback();
		}

		// var path = metalsmith.path(opts.directory);
		// console.log(path);
		// console.log(metalsmith.path());
		// for (var file in files) {

			// console.log(files[file]);
			// files[file].blocs = path + '/' + file;
			//  fs.writeFile("file", "files[file]", (err) => {
			// 	 if (err) return console.log(err);
			//  })
			//  console.log(files[file]);
		//  }
		// console.log('Files:');
		// console.log(Object.keys(files));


		// Return array of files list
		// var arr = readBlocs(opts.directory, metalsmith, (err, data) => {
		// 	if (err) throw err;
		// 	console.log(data);
		// 	// metalsmith.metadata({blocs: data});
		// 	// console.log(metalsmith);
		// });

		// console.log(metalsmith.metadata());

		// //Change SRC and build to get files properties in metalsmith
		// var defaultSrc = metalsmith.source();
		// console.log("Default src: ", defaultSrc);
		//
		// var newSrc = metalsmith.source(metalsmith.path(opts.directory));
		// console.log("New src: ", newSrc);
		//
		// console.log("Setting src: ", metalsmith.source());
		//
		// metalsmith.build((err, files) => {
		// 	if (err) throw err;
		// 		// exit(1);
		// 	// console.log(err);
		// 	console.log("Files: ");
		// 	console.log(files);
		// });

		// async.filter(Object.keys(files), filterFile, function (err, result) {
		// 	if (err) console.log(err);
		// 	console.log(result);
		// });

		// function concatFile(file, done) {
		//
		// }

		var listFiles = Object.keys(files);
		var filtredListFiles = listFiles.filter(filterFile);
		// console.log(filtredListFiles);

		async.each(filtredListFiles, (item, callback) => {
			// console.log(item);
			// console.log(files[item].blocs);
			var blocsPath = files[item].blocs.map((item) =>{
				return path.join(metalsmith.path(opts.directory), item);
			});
			// console.log(blocsPath);

			var buffer;
			var arrBuffers = [];
			var bufferTotalLength = 0;

			async.each(blocsPath, (filePath, callback) => {
				// readFile(filePath, (err, data) => {
				fs.readFile(filePath, (err, data) => {
					if (err) console.log('Error: ', err);
					// console.log(data.length);
					bufferTotalLength += data.length;
					arrBuffers.push(data);
					// buffer = Buffer.concat([buffer, data], bufferTotalLength);
					// Buffer(data, data.l)
					// console.log(data.length);
					callback();
				});
			}, (err, done) => {
				if (err) console.log('Error Buffer: ', err);
				// console.log('Buffer length: ', arrBuffers.length);
				buffer = Buffer.concat(arrBuffers, bufferTotalLength);
				// console.log(buffer);
				// console.log(buffer.length);
				files[item].contents = buffer;
				// console.log(files[item]);
				console.log(files);
				callback();

			});
			// console.log(metalsmith.destination());
			// concat(blocsPath, path.join(metalsmith.path("test"), item), () => callback());
			// callback();
			// console.log(files[item].blocs);
			// done();
			// callback(files[item].blocs);
		}, (err, callback) => {
			if (err) console.log('Error: ', err);
			done();
		});

		// done();
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

// function readFile(pathFile, done) {
// 	fs.readFile(pathFile, (err, data) => {
// 		if (err) throw err;
// 		done(null, data);
// 	})
// }
