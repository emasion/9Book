'use strict'

var pkg = require('../package.json')
var bower = require('bower')
var conf = require('../config/gulp.config')
var gulp = require('gulp')

var config = {
    paths: {
        app: 'scripts/views/application',
        helper: 'scripts/utils/helper',
        jquery: 'vendor/jquery/dist/jquery',
        jqueryDoubleTap: 'lib/jquery-plugin/jquery.doubletap',
        jqueryTouchy: 'vendor/touchy/jquery.touchy.min',
        jqueryMobileEvents: 'vendor/jquery-mobile-events/jquery-mobile-events',
        jqueryIndexedDB: 'vendor/jquery-indexeddb/jquery.indexeddb',
        jqueryEasing: 'lib/masterslider/jquery.easing.min',
        jqueryCookie: 'vendor/jquery-cookie/jquery.cookie',
        jqueryPanelSlider: 'vendor/jquery-panelslider/jquery.panelslider.min',
        typeahead: 'vendor/typeahead.js/dist/typeahead.jquery',
        bloodhound: 'vendor/typeahead.js/dist/bloodhound',
        masterslider: 'lib/masterslider/masterslider',
        backbone: 'vendor/backbone/backbone',
        underscore: 'vendor/underscore/underscore',
        lodash: 'vendor/lodash/lodash',
        bootstrap: 'vendor/bootstrap/dist/js/bootstrap',
        bootstrapSlider: 'vendor/bootstrap-slider/bootstrap-slider',
        //'bootstrap-window': 'lib/bootstrap-window/dist/js/bootstrap-window',
        'bootstrap-window': 'lib/bootstrap-window/bootstrap-window',
        'bootstrap-dialog': 'vendor/bootstrap-dialog/dist/js/bootstrap-dialog.min',
        Handlebars: 'lib/handlebars/handlebars-v3.0.1',
        templates: '.tmp/templates',
        turnjs: 'lib/turnjs/turn',
        zoom: 'lib/turnjs/zoom',
        modernizr: 'vendor/modernizr/modernizr',
        moment: 'vendor/moment/min/moment-with-locales.min',
        yepnope: 'vendor/yepnope/yepnope',
        cssplugin: 'vendor/gsap/src/minified/plugins/CSSPlugin.min',
        easePack: 'vendor/gsap/src/minified/easing/EasePack.min',
        TweenLite: 'vendor/gsap/src/minified/TweenLite.min',
        videojs: 'vendor/video.js/dist/video-js/video'
    },
    shim: {
        lodash: {
            exports: '_'
        },
        backbone: {
            deps: [ 'underscore', 'jquery' ],
            exports: 'Backbone'
        },
        jqueryDoubleTap: {
            deps: ['jquery']
        },
        jqueryTouchy: {
            deps: ['jquery']
        },
        jqueryMobileEvents: {
            deps: ['jquery']
        },
        jqueryIndexedDB: {
            deps: ['jquery']
        },
        jqueryEasing: {
            deps: ['jquery']
        },
        jqueryCookie: {
            deps: ['jquery']
        },
        jqueryPanelSlider: {
            deps: ['jquery']
        },
        typeahead: {
            deps: ['jquery']
        },
        Handlebars: {
            deps: ['typeahead', 'jquery']
        },
        bloodhound: {
            deps: ['jquery', 'typeahead']
        },
        masterslider: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        'bootstrap-dialog': {
            deps: ['bootstrap', 'jquery']
        },
        bootstrapSlider: {
            deps: ['bootstrap']
        },
        'bootstrap-window': {
            deps: ['bootstrap']
        },
        turnjs: {
            deps: ['jquery', 'modernizr']
        },
        zoom: {
            deps: ['jquery', 'turnjs']
        },
        modernizr: {
            deps: ['yepnope']
        },
        moment: {
            deps: ['jquery']
        },
        TweenLite: {
            deps: ['easePack']
        },
        'app': {
            deps: [
                'jquery',
                'masterslider',
                'backbone',
                'helper',
                'jqueryDoubleTap',
                'jqueryTouchy',
                'jqueryMobileEvents',
                'jqueryIndexedDB',
                'jqueryEasing',
                'jqueryCookie',
                'jqueryPanelSlider',
                'typeahead',
                'Handlebars',
                'bloodhound',
                'cssplugin',
                'easePack',
                'bootstrap-dialog',
                'turnjs',
                'bootstrap',
                'bootstrapSlider',
                'bootstrap-window',
                'scripts/models/Config',
                'modernizr',
                'moment',
                'yepnope',
                'zoom',
                'TweenLite',
                'videojs'
            ]
        }
    }
}

console.info(config)
module.exports = config