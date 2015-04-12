/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/routes/Router',
	'scripts/models/TableList',
	'scripts/views/MainBook'
], function(Backbone, JST, theRouter, tableListModel, mainBook) {
    'use strict';

	var TableListView = Backbone.View.extend({
		template: JST['app/scripts/templates/TableList.ejs'],

		onListItemClickHandler: function(e) {
			var self = this,
				$el = this.$el,
				target = e.currentTarget,
				item;

			item = $(target).find('.tablelist-page');
			if(item) {
				mainBook().bookComponent.gotoPage(parseInt(item.text(), 10));
				self.selectChange($(target));
				//$.panelslider.close();
			}
		},

		onRouterInPage: function (query, page) {
			var self = this,
				$el = this.$el,
				$target;

			$.each($el.find('.tablelist-page'), function(key, elmenet) {
				if(parseInt($(elmenet).text(), 10) === parseInt(page, 10)) {
					$target = $(elmenet).parents('.ms-thumb-frame');
					return false;
				}
			});

			self.selectChange($target);
		},

		selectChange: function($target) {
			var self = this,
				$el = this.$el;

			$el.find('.ms-thumb-frame').removeClass('selected');
			if($target) {
				$target.addClass('selected');
			}
		},

		events: function() {
			return MOBILE ?
			{
				'touchstart .ms-thumb-frame': 'onListItemClickHandler'
			} : {
				'click .ms-thumb-frame': 'onListItemClickHandler'
			};
		},

		initialize: function () {
			var self = this,
				$el = this.$el;

			tableListModel().on('loadComplete', _.bind(self.render, self));
			tableListModel().load();

			// router page move event add
			theRouter().on("route:page", _.bind(self.onRouterInPage, self));
		},

		render: function() {
			var self = this,
				$el = this.$el,
				tableList;

			if (tableListModel().tableList) {
				tableList = tableListModel().tableList;
			}

			$el.html(self.template({
				tableList: tableList
			}));

			// 썸네일 생성
			self.tableListSlider = new MasterSlider();
			self.tableListSlider.control('thumblist' ,
				{
					autohide: false,
					dir:'v',
					arrows: false,
					align: 'right',
					width: $el.width(),
					height: 40,
					margin: 0,
					space: 1,
					hideUnder: 100
				});

			self.tableListSlider.setup('tableListSlider', {
				width: $el.width(),
				height: $(window).height() - 120,
				space: 0,
				speed: 0,
				wheel: true
			});

			self.onRouterInPage('', theRouter().getRouterPage());
		}
	});

	// 싱글톤 처리
	var instance;
	return function() {
		if(!instance) {
			instance = new TableListView({
				el: $('#tableList')
			});
		}
		return instance;
	};
});
