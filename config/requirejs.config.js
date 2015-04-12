'use strict'

var pkg = require('../package.json')
var bower = require('bower')
var conf = require('../config/gulp.config')
var gulp = require('gulp')

var config = {
    paths: {
        app: 'scripts/views/application',
        helper: 'scripts/utils/helper',
        jquery: 'lib/jquery/dist/jquery',
        jqueryDoubleTap: 'vendor/jquery-plugin/jquery.doubletap',
        jqueryTouchy: 'lib/touchy/jquery.touchy.min',
        jqueryMobileEvents: 'lib/jquery-mobile-events/jquery-mobile-events',
        jqueryIndexedDB: 'lib/jquery-indexeddb/jquery.indexeddb',
        jqueryEasing: 'vendor/masterslider/jquery.easing.min',
        jqueryCookie: 'lib/jquery-cookie/jquery.cookie',
        jqueryPanelSlider: 'lib/jquery-panelslider/jquery.panelslider.min',
        typeahead: 'lib/typeahead.js/dist/typeahead.jquery',
        bloodhound: 'lib/typeahead.js/dist/bloodhound',
        masterslider: 'vendor/masterslider/masterslider',
        backbone: 'lib/backbone/backbone',
        underscore: 'lib/underscore/underscore',
        bootstrap: 'lib/bootstrap/dist/js/bootstrap',
        bootstrapSlider: 'lib/bootstrap-slider/bootstrap-slider',
        //'bootstrap-window': 'lib/bootstrap-window/dist/js/bootstrap-window',
        'bootstrap-window': 'vendor/bootstrap-window/bootstrap-window',
        'bootstrap-dialog': 'lib/bootstrap-dialog/dist/js/bootstrap-dialog.min',
        Handlebars: 'lib/handlebars.js/dist/handlebars',
        templates: '.tmp/templates',
        turnjs: 'vendor/turnjs/turn',
        zoom: 'vendor/turnjs/zoom',
        modernizr: 'lib/modernizr/modernizr',
        moment: 'lib/moment/min/moment-with-locales.min',
        yepnope: 'lib/yepnope/yepnope',
        cssplugin: 'lib/gsap/src/minified/plugins/CSSPlugin.min',
        easePack: 'lib/gsap/src/minified/easing/EasePack.min',
        TweenLite: 'lib/gsap/src/minified/TweenLite.min',
        videojs: 'lib/video.js/dist/video-js/video'
    },
    shim: {
        underscore: {
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