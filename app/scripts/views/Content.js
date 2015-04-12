/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/collections/Contents',
	'scripts/views/contents/Image',
	'scripts/views/contents/Link',
	'scripts/views/contents/Text',
	'scripts/views/contents/Video'
], function(Backbone, JST, contentsCollection, ImageContent, LinkContent, TextContent, VideoContent) {
    'use strict';

	var ContentView = Backbone.View.extend({
		events: {
		},

		initialize: function () {
			var self = this,
				$el = this.$el;
		},

		getContentData: function(page) {
			var self = this,
				$el = this.$el;

			return contentsCollection().get(page);
		},

		render: function(page) {
			var self = this,
				$el = this.$el;

			var contentModel = self.getContentData(page);
			if(_.isUndefined(contentModel)) {
				return;
			}

			console.log('---------- contentModel :: ',page, contentModel);

			$.each(contentModel.get('items'), function(key, item) {
				console.log('---------- contentModel type :: ', item.type);
				var $element = $("<div/>");
				$el.append($element);
				switch (item.type) {
					case 'image':
						new ImageContent({
							el: $element,
							data: item
						});
						break;
					case 'text':
						new TextContent({
							el: $element,
							data: item
						});
						break;
					case 'link':
						new LinkContent({
							el: $element,
							data: item
						});
						break;
					case 'video':
						new VideoContent({
							el: $element,
							data: item
						});
						break;
					default:
						console.log('default');
				}
			});
		}
    });

	return ContentView;
});
