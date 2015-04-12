/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
	'backbone',
	'templates',
	'scripts/views/contents/Contents'
], function(Backbone, JST, Contents) {
	'use strict';

	var Video = Contents.extend({
		template: JST['app/scripts/templates/ContentVideo.ejs'],
		events: {
		},

		render: function(value) {
			var self = this,
				$el = this.$el;

			videojs.options.flash.swf = 'public/contents/video-js.swf';
			$el.html(self.template(value));

			videojs('contentVideo_' + value.id, {
				"controls": true,
				"autoplay": false,
				"preload": "auto"
			});
		}
	});

	return Video;
});
