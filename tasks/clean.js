
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var rimraf = require('gulp-rimraf')

/* clean */
gulp.task('clean', function() {
	return gulp.src([TMP_DIR, conf.paths.src.tmp], { read: false })
		.pipe(rimraf({ force: true }))
})

/* clean:dist */
gulp.task('clean:dist', function() {
	return gulp.src([BUILD_DIR], { read: false })
		.pipe(rimraf({ force: true }))
})