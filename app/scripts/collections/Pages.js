/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'scripts/models/Page'
], function(Backbone, PageModel) {
    'use strict';

	var PageCollection = Backbone.Collection.extend({
		url: './public/json/pages.json',
		dataType: 'json',
		model: PageModel,
		parse: function(response) {
			return response;
		},
		// Overwrite the sync method to pass over the Same Origin Policy
		/*
		 sync: function(method, model, options) {
		 var self = this;
		 var params = _.extend({
		 type: 'GET',
		 dataType: 'jsonp',
		 url: self.url,
		 processData: false
		 }, options);

		 return $.ajax(params);
		 },
		 */
		initialize: function() {
			var self = this;
		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new PageCollection();
			return instance;
		}
		return instance;
	};
});
