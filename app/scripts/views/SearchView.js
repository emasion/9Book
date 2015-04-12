/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/views/MainBook',
	'scripts/views/WindowManager'
], function(Backbone, JST, mainBook, WindowManager) {
    'use strict';

	var SearchView = Backbone.View.extend({
		SEARCH_VIEW_ID: 'searchViewPopup',
		template: JST['app/scripts/templates/SearchView.ejs'],
		events: {
			/* page mouse event, contents event? */

		},

		open: function (kwd) {
			var self = this,
				$el = this.$el;

			if(new WindowManager().getWindow(self.SEARCH_VIEW_ID)) {
				return;
			}

			var engine = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: 'public/json/searchtext.json'
			});

			var promise = engine.initialize();
			promise
				.done(function() {
					engine.get(kwd, function (suggestions) {
						var totalLength = suggestions.length,
							getItems = [];
						$.each(suggestions, function (index, item) {
							getItems.push({
								row: index + 1,
								searchText: item.value.replace(new RegExp(kwd,'g'), '<span class="highlight">' + kwd + '</span>'),
								page: item.page
							});
						});

						// popup open
						self.searchWindow = new WindowManager();
						self.searchWindow.open({
							id: self.SEARCH_VIEW_ID,
							title: "검색창",
							bodyContent: $(self.template({
								totalLength: totalLength,
								searchItems: getItems,
								kwd: kwd
							})),
							footerContent: '<button type="button" class="btn btn-default" data-dismiss="window">닫기</button>',
							width: (MOBILE) ? $(window).width() - 80 : 600,
							height: (MOBILE) ? $(window).height() - 80 : 600
						});

						//$('#' + self.SEARCH_VIEW_ID).find()
						$('[data-id=searchTable]').off();
						$('[data-id=searchTable]').find('tr').on(MOBILE ? 'touchstart' : 'click', function(e) {
							var $target = $(e.currentTarget);
							//console.log($target.attr('data-page'));
							mainBook().bookComponent.gotoPage(parseInt($target.attr('data-page'), 10));
							new WindowManager().close(self.SEARCH_VIEW_ID);
						});

					});
				})
				.fail(function() {
					console.log('err!');
				});
		},

		initialize: function () {
			var self = this,
				$el = this.$el;
		},

		render: function () {
			// 화면 구성
		}
	});

	// 싱글톤 처리
	var instance;
	return function() {
		if(!instance) {
			instance = new SearchView({
				el: $('#searchView')
			});
		}
		return instance;
	};
});
