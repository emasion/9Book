/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone'
], function(Backbone) {
    'use strict';

	var SearchText = Backbone.Model.extend({
		searchText: null,
		find: function(kwd) {

		},
		initialize: function () {
			// TODO : json 데이터 받아온다?			var self = this;
		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new SearchText();
			return instance;
		}
		return instance;
	};
});
