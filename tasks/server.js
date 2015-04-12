'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var browserSync = require('browser-sync')
var middleware = require('./proxy')

/* 변경 내용 감시 및 변경시 처리 task 지정 */
gulp.task('watch', function () {
	gulp.watch('app/scripts/**/*.js', [['lint', 'preprocess'], browserSync.reload])
	gulp.watch('app/scripts/templates/**/*.ejs', [['jst'], browserSync.reload])
	gulp.watch('app/index.html', [['inject'], browserSync.reload])
	gulp.watch('bower.json', ['inject'])
})

function browserSyncInit(baseDir, files, browser, port) {
	browser = browser === undefined ? 'default' : browser;

	browserSync.instance = browserSync.init(files, {
		startPath: '/index.html',
		notify: false,
		injectFileTypes: ["css", "png", "jpg", "jpeg", "svg", "gif", "webp"],
		server: {
			baseDir: baseDir,
			middleware: middleware
		},
		browser: browser,
		port: port
	})
}

/* serve 구동 - dev */
gulp.task('serve', ['watch'], function() {
	browserSyncInit(
		['.tmp', 'app'],
		['.tmp/**/*.js', '.tmp/**/*.css', '.tmp/*.html'],
		'',
		9001
	)
})

/* serve 구동 - dist */
gulp.task('serve:build', ['build'], function() {
	browserSyncInit(
		['dist'],
		null,
		'',
		9002
	)
})

/* serve 구동 - dist */
gulp.task('serve:dist', function() {
	browserSyncInit(
		['dist'],
		null,
		'',
		9002
	)
})



