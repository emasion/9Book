
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var runSequence = require('run-sequence')

gulp.task('build', ['install'], function(done) {
	runSequence(
		'clean:dist',
		'lint',
		['optimize', 'inject', 'copy:requirejs'],
		['images'],
		'usemin',
		['copy:fonts', 'copy:public', 'copy:msimages'],
		done
	);
})