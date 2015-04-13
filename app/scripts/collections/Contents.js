/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'scripts/models/Content'
], function(Backbone, ContentModel) {
    'use strict';

	var ContentsCollection = Backbone.Collection.extend({
		url: './public/json/contents.json',
		dataType: 'json',
		model: ContentModel,
		parse: function(response) {
			//return response.contents;
			return response;
		},
		initialize: function() {
			var self = this;
		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new ContentsCollection();
			return instance;
		}
		return instance;
	};
});
