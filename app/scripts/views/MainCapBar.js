/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'helper',
	'scripts/routes/Router',
	'scripts/views/Bookmark',
	'scripts/views/MainBook',
	'scripts/views/SearchView',
	'scripts/views/TableList',
	'Handlebars',
	'bootstrap-dialog'
], function(Backbone, JST, theHelper, theRouter, bookmarkContainer, mainBook, SearchView, TableListView, Handlebars, BootstrapDialog) {
    'use strict';

	var MainCapBarView = Backbone.View.extend({
		template: JST['app/scripts/templates/MainCapBar.ejs'],

		onClickHome: function () {
			var self = this,
				$el = this.$el;
		},

		onClickPrint: function () {
			var self = this,
				$el = this.$el;
		},
		// 북마크 추가
		onClickBookmark: function () {
			var self = this,
				$el = this.$el;

			var currentPage = theRouter().getRouterPage();
			if (currentPage > 0 && _.isNumber(currentPage)) {
				bookmarkContainer().changeBookmark(currentPage);
			}
		},

		onClickThumb: function () {
			var self = this,
				$el = this.$el;

			mainBook().thumbnailSlider.change();
		},

		onClickList: function () {
			var self = this,
				$el = this.$el;
		},

		onClickZoom: function () {
			var self = this,
				$el = this.$el;

			mainBook().bookComponent.zoom();
		},

		onClickClose: function () {
			var self = this;

			try {
				/*
				if(!theHelper().isAndroid() || Util.isChrome()){
					var message = null;
					if(Language.isLanguagePack()) message = Language.getLanguage("confirmEbookExit");
					else message = 'eBook을 종료합니까?';
					var close = confirm(message);
					if(close)window.open('about:blank', '_self').close();
				}
				*/
				BootstrapDialog.confirm('9Book을 종료하시겠습니까?', function(result) {
					if(result) {
						self.opener = self;
						window.close();
					}
				});

			} catch (e) {
				alert(e);
			}
		},
		// 검색창 오픈
		openSearchView: function(kwd) {
			var self = this,
				$el = this.$el;

			console.log(kwd);
			new SearchView().open(kwd);
		},

		onClickSearch: function() {
			var self = this,
				$el = this.$el,
				$searchInput = $el.find('[data-id=prefetch] .typeahead'),
				kwd = $searchInput.typeahead('val');

			if(kwd) {
				self.openSearchView(kwd);
			}else {
				// 검색어 입력 요청
				BootstrapDialog.show({
					message: '검색어를 입력하세요.'
				});
				$searchInput.focus();
			}
		},

		initTableList: function() {
			var self = this,
				$el = this.$el,
				$tableList = $el.find('[data-id=btnList]');

			// panelslider
			$tableList.panelslider({side: 'left', duration: 200 });

			// tableList view init
			new TableListView();
		},

		initWidget: function() {
			var self = this,
				$el = this.$el,
				$searchInput = $el.find('[data-id=prefetch] .typeahead');

			// 검색창
			var searchtext = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: '../public/json/searchtext.json'
			});

			// kicks off the loading/processing of `local` and `prefetch`
			searchtext.initialize();

			// passing in `null` for the `options` arguments will result in the default
			// options being used
			$searchInput.typeahead({
					//minLength: 3,
					highlight: true
				},
				{
					name: 'searchtext',
					displayKey: 'value',
					source: searchtext.ttAdapter(),
					templates: {
						empty: [
							'<div class="empty-message">',
							'일치하는 단어가 없습니다.',
							'</div>'
						].join('\n'),
						suggestion: Handlebars.compile('<p><strong>{{value}}</strong> – <span class="tt-page">{{page}}페이지</span></p>')
					}
				}).bind('typeahead:opened', function(event) {
					self.selected = false;
				}).bind('typeahead:selected', function(event, data) {
					console.log(event, data);
					// 선택 페이지 이동 처리
					var page = (_.has(data, 'page')) ? data.page : null;
					if(page) {
						mainBook().bookComponent.gotoPage(page);
						$searchInput.typeahead('val', '');
						self.selected = true;
					}
				}).bind('keydown', function(event) {
					if(event.keyCode === 13) {
						if(self.selected) {
							return;
						}
						self.openSearchView($searchInput.typeahead('val'));
						$searchInput.typeahead('val', '');
						$searchInput.typeahead('close');
					}
				});

			// tablelist slider
			self.initTableList();
		},

		events: function () {
			return MOBILE ?
			{
				'touchstart [data-id=btnHome]': 'onClickHome',
				'touchstart [data-id=btnPrint]': 'onClickPrint',
				'touchstart [data-id=btnBookmark]': 'onClickBookmark',
				'touchstart [data-id=btnThumb]': 'onClickThumb',
				'touchstart [data-id=btnList]': 'onClickList',
				'touchstart [data-id=btnZoom]': 'onClickZoom',
				'touchstart [data-id=btnClose]': 'onClickClose'
			} : {
				'click [data-id=btnHome]': 'onClickHome',
				'click [data-id=btnPrint]': 'onClickPrint',
				'click [data-id=btnBookmark]': 'onClickBookmark',
				'click [data-id=btnThumb]': 'onClickThumb',
				'click [data-id=btnList]': 'onClickList',
				'click [data-id=btnZoom]': 'onClickZoom',
				'click [data-id=btnClose]': 'onClickClose',
				'click [data-id=btnSearch]': 'onClickSearch'
			};
		},

		initialize: function () {
			// TODO : 메뉴 생성 및 기능 정의 api
			var self = this,
				$el = this.$el;

			$el.html(this.template());

			// initWidget
			self.initWidget();
		}
	});

    return MainCapBarView;
});
