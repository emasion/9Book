'use strict'

var pkg = require('../package.json')
var bower = require('bower')
var conf = require('../config/gulp.config')
var gulp = require('gulp')

global.SRC_DIR = 'app'
global.BUILD_DIR = 'dist'
global.TMP_DIR = '.tmp'
global.BOWER_DIR = bower.config.directory

var config = {
    version: pkg.version,
    paths: {
        src: {
            scripts: SRC_DIR + '/scripts/**/*.js',
            templates: SRC_DIR + '/scripts/templates/**/*.ejs',
            styles: SRC_DIR + '/assets/styles/**/*.css',
            images: SRC_DIR + '/assets/images/**/*.*',
            fonts: SRC_DIR + '/assets/fonts/**/*.*',
            html: SRC_DIR + '/index.html',
            vendor: SRC_DIR + '/vendor/**/*.*',
            lib: SRC_DIR + '/lib/**/*.*',
            tmp: SRC_DIR + '/.tmp',
            requirejs: SRC_DIR + '/lib/requirejs/require.js',
            public: SRC_DIR + '/public/**/*.*',
            msimages: [
                SRC_DIR + '/vendor/masterslider/style/loading-2.gif',
                SRC_DIR + '/vendor/masterslider/skins/light-6/light-skin-6.png',
                SRC_DIR + '/vendor/masterslider/skins/light-6/light-skin-6-retina.png',
            ]
        },
        dist: {
            scripts: BUILD_DIR + '/scripts',
            styles: BUILD_DIR + '/assets/styles',
            images: BUILD_DIR + '/assets/images',
            fonts: BUILD_DIR + '/assets/fonts',
            requirejs: BUILD_DIR + '/lib/requirejs',
            public: BUILD_DIR + '/public'
        },
        tmp: {
            scripts: TMP_DIR + '/scripts/**/*.js',
            styles: TMP_DIR + '/assets/styles',
            html: TMP_DIR + '/index.html',
            folder_scripts: TMP_DIR + '/scripts'
        }
    }
}

console.info(config)
module.exports = config