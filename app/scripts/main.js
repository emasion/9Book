/*global require*/
'use strict';

require.config({
    baseUrl: './',
    shim: '@@<!--shim-->@@',
    paths: '@@<!--paths-->@@'
});

require([
    'backbone',
	'helper',
    'app'
], function (Backbone, theHelper, ApplicationView) {
    Backbone.history.start();

	window.DOMAIN = 'http://127.0.0.1:9000';
	// mobile check
	window.MOBILE = theHelper().is.isMobile();
	// moment locale setup
	moment.locale('ko');

    new ApplicationView();
});
