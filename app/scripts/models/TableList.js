/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone'
], function(Backbone) {
    'use strict';

	var TableListModel = Backbone.Model.extend({
		url: '/public/json/tablelist.json',
		dataType: 'json',
		tableList: [],
		load: function () {
			var self = this;
			this.fetch({
				success: (function (data) {
					if (data && _.isObject(data.attributes)) {
						_.forEach(data.attributes, function (n) {
							self.tableList.push(n)
						})
					}
				}),
				error: (function (e) {
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
			instance = new TableListModel();
			return instance;
		}
		return instance;
	};
});
