/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
	'backbone',
	'templates',
	'scripts/views/contents/Contents'
], function(Backbone, JST, Contents) {
	'use strict';

	var Text = Contents.extend({
		template: JST['app/scripts/templates/ContentText.ejs'],
		events: {
		},

		render: function(value) {
			var self = this,
				$el = this.$el;

			console.log(value);
			$el.html(self.template(value));
		}
	});

	return Text;
});
