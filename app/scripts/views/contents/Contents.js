/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
	'backbone',
	'templates'
], function(Backbone, JST) {
	'use strict';

	var ContentView = Backbone.View.extend({
		CONTENT_PATH: './public/contents/',
		events: {
		},

		_initDo: function() {
			var self = this;
		},

		render: function(options) {

		},

		initialize: function(options) {
			var self = this,
				value = options.data;

			if(_.has(value.options, 'imageUrl') && value.options.imageUrl.indexOf('/') === -1) {
				value.options.imageUrl = self.CONTENT_PATH + value.options.imageUrl;
			}

			if(_.has(value.options, 'imageUrlHover') && value.options.imageUrlHover.indexOf('/') === -1) {
				value.options.imageUrlHover = self.CONTENT_PATH + value.options.imageUrlHover;
			}

			if(_.has(value.options, 'posterUrl') && value.options.posterUrl.indexOf('/') === -1) {
				value.options.posterUrl = self.CONTENT_PATH + value.options.posterUrl;
			}

			if(_.has(value.options, 'videoUrl') && value.options.videoUrl.indexOf('/') === -1) {
				value.options.videoUrl = self.CONTENT_PATH + value.options.videoUrl;
			}

			self.render(value);
		}
	});

	return ContentView;
});
