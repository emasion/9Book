/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
	'backbone'
], function(Backbone) {
	'use strict';

	var Router = Backbone.Router.extend({
		_routerPage: 1,
		routes: {
			":query/:page": "page",    // #page
			"help": "help",    // #help
			"search/:query": "search",  // #search/kiwis
			"search/:query/p:page": "search"   // #search/kiwis/p7
		},

		setRouterPage: function(routerPage) {
			if(!routerPage) {
				return;
			}
			this._routerPage = parseInt(routerPage, 10);
		},

		getRouterPage: function() {
			return this._routerPage;
		},
		// url을 통해 들어온 page - url을 바꿔줄 필요 없다.
		page: function(query, page) {
			//console.log("[routerPage] :" ,query, page);
			this.setRouterPage(page);
		},

		help: function() {

		},

		search: function(query, page) {

		},

		getHash: function() {
			return window.location.hash.slice(1);
		},

		checkHash: function() {
			var hash = this.getHash();
			return hash.split(/\//);
		},

		hashPageChange: function(pageNumber) {
			var self = this;
			self.navigate("#page/" + pageNumber);
			self.setRouterPage(pageNumber);
		},

		initialize: function() {
			// 최초 /#page/페이지번호 가져온다.
			//console.log('최초 /#page/페이지번호 가져온다', this.checkHash());
			var hash = this.checkHash();
			if(hash[0] === 'page' && _.isNumber(parseInt(hash[1]))) {
				this.page(hash[0], hash[1]);
			}
		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new Router();
			return instance;
		}
		return instance;
	};
});
