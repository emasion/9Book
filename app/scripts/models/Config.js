
define([
    'backbone'
], function(Backbone) {
    'use strict'

	var Config = Backbone.Model.extend({
		url: './public/json/config.json',
		dataType: 'json',
		defaults: {
			"version": "0.1",
			"title": "SOFTBOOK Prototype v0.1",
			"totalPages": "10",
			"startPage": "1",
			"language": "ko",
			"flipType": "flip",
			"layoutType": "default",
			"debuggerUse": false,
			"bookConfig": {
				"bookSizeFix": false,
				"bookSizeRadio": 0.9,
				"sizeRadio": [54, 70],
				"bookWidth": 540,
				"bookHeight": 700,
				"hardCover": false,
				"hardCoverAll": false,
				"innerSmallPage": false,
				"innerSmallPageMargin": 10,
				"bookSideDepth": false,
				"gradients": true,
				"acceleration": false,
				"duration": 600,
				"inclination": 0,
				"elevation": 50,
				"bookSingle": false,
				"toolbarHeight": 100,
				"zoomData": {
					"pageZoomDefault": 2,
					"pageZoomMin": 1,
					"pageZoomMax": 5
				}
			}
		},
		config: {},
		load: function () {
			var self = this
			this.fetch({
				success: (function (data) {
					if (data && _.isObject(data.attributes)) {
						self.config = data.attributes;
						console.log(self.config)
					}
				}),
				error: (function (e) {
					self.config = self.defaults;
					alert(' Service request failure: ' + e);
				}),
				complete: (function (e) {
					self.trigger('loadComplete')
				})
			})
		},
		initialize: function () {

		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new Config()
			return instance
		}
		return instance
	}
})
