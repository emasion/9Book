/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates'
], function(Backbone, JST) {
    'use strict';

	var ThumbnailItemView = Backbone.View.extend({
		template: JST['app/scripts/templates/ThumbnailItem.ejs'],

		events: function () {
			return MOBILE ?
			{

			} : {

			};
		},

		initialize: function() {
			var self = this,
				$el = this.$el;

		},

		render : function() {
			var self = this,
				$el = this.$el;

			this.$el.html(self.template(self.model.attributes));
			return this.$el;
		}
	});

	return ThumbnailItemView;
});
