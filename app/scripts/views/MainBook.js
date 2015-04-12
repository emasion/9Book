/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/models/Page',
	'scripts/models/Content',
	'scripts/models/Config',
	'helper',
	'scripts/routes/Router',
	'scripts/collections/Pages',
	'scripts/collections/Contents',
	'scripts/views/ThumbnailSlider',
	'scripts/views/BookComponentFlip',
	'scripts/views/BookComponentSlide',
	'scripts/views/BookComponentPage',
	'scripts/views/WindowManager',
	'scripts/views/Bookmark'
], function(Backbone, JST, PageModel, ContentModel, config, theHelper, theRouter, PagesCollection, ContentsCollection, ThumbnailSliderView, BookComponentFlipView, BookComponentSlideView, BookComponentPageView, WindowManager, BookmarkContainer) {
    'use strict';

	var MainBookView = Backbone.View.extend({
		thumbnailSlider: null,
		bookComponent: null,
		bookmarkContainer: null,
		config: null,
		template: JST['app/scripts/templates/MainBook.ejs'],
		_initBook: function (pages, contents) {
			var self = this,
				$el = this.$el;

			console.log('-------------- Init Book ---------------');
			console.log('--- BookData : ', pages, contents);

			// initBookComponent
			self.initBookComponent(pages);
			// init bookmarkContainer
			self.initBookmarkContainer(pages);
			//init thumbnailSlider
			self.initThumbnailSlider(pages);
		},

		initBookComponent: function(data) {
			var self = this,
				$el = this.$el,
				deferred = $.Deferred(),
				$bookContainer = $el.find('#bookContainer');

			// flip 형
			if (self.config.flipType === 'flip') {
				self.bookComponent = new BookComponentFlipView({
					collection: data,
					el: $bookContainer
				});
			}
			// slide 형
			else if (self.config.flipType === 'slide') {
				self.bookComponent = new BookComponentSlideView({
					collection: data,
					el: $bookContainer
				});
			}
			// page 형
			else if (self.config.flipType === 'page') {
				self.bookComponent = new BookComponentPageView({
					collection: data,
					el: $bookContainer
				});
			}

			return deferred;
		},

		initBookmarkContainer: function(data) {
			var self = this,
				$el = this.$el;

			// bookmark setup
			self.bookmarkContainer = new BookmarkContainer();
			self.bookmarkContainer.init({
				mode: 'last',
				bookComponent: self.bookComponent.$bookComponent,
				totalPages: data.length,
				view: self.bookComponent.getView(),
				getViewCallback: function() {
					return  self.bookComponent.getView();
				}
			});

			// event bind
			self.bookComponent.on('TURNING_FLIP', function(args) {
				self.bookmarkContainer.turningFlipHandler(args);

			});
			self.bookComponent.on('TURNED_FLIP', function(args) {
				self.bookmarkContainer.turnedFlipHandler(args);
				self.thumbnailSlider.setPage(args.page);
				self.tableListSlider().onRouterInPage('', args.page);
			});
		},

		initThumbnailSlider: function(data) {
			var self = this,
				$el = this.$el;

			self.thumbnailSlider = new ThumbnailSliderView({
				collection: data,
				sizeRadio: self.bookComponent.bookConfig.sizeRadio,
				start: theRouter().getRouterPage()
			});


			// event bind
			self.thumbnailSlider.on('GO_TO_PAGE', function(args) {
				self.onRouterInPage('', args.page);
			});
		},

		goFirstPage: function () {
			var self = this;
			self.bookComponent.firstPage();
		},

		goPrevPage: function () {
			var self = this;
			self.bookComponent.prevPage();
		},

		goNextPage: function () {
			var self = this;
			self.bookComponent.nextPage();
		},

		goLastPage: function () {
			var self = this;
			self.bookComponent.lastPage();
		},

		onRouterInPage: function (query, page) {
			var self = this;
			self.bookComponent.gotoPage(page);
		},

		onMouseWheel: function (e) {
			var self = this,
				delta = theHelper().uiEvent.getWheelDelta(e.originalEvent),
				dt = e.timeStamp - (this.mouseWheelStartTime || 0);

			if (dt < 30) {
				return;
			}
			this.mouseWheelStartTime = e.timeStamp;
			if (delta < 0) {
				// prev page
				self.bookComponent.nextPage();
			}
			else if (delta > 0) {
				// next page
				self.bookComponent.prevPage();
			}
		},

		onKeydown: function (e) {
			var self = this;
			if (self.bookComponent.isZoomMode()) {
				return;
			}
			switch (e.keyCode) {
				case 39:
					// next page
					self.bookComponent.nextPage();
					break;
				case 37:
					// prev page
					self.bookComponent.prevPage();
					break;
				case 32:
					// zoom mode
					self.bookComponent.zoom();
					break;
			}
		},

		addKeyEvent: function () {
			var self = this,
				$el = this.$el;
			$(document).off('keydown.mainbook', _.bind(self.onKeydown, self));
			$(document).on('keydown.mainbook', _.bind(self.onKeydown, self));
		},

		addWindowResizeEvent: function() {
			var self = this;
			var resizeEvent = _.debounce(function(e) {
				if(self.bookComponent) { self.bookComponent.resizeViewport(e); }
			}, 300);
			// window resize event add
			$(window).on('resize', resizeEvent);
			$(window).on('orientationchange', resizeEvent);
		},

		events: {
			'mousewheel': 'onMouseWheel'
		},

		initialize: function () {
			var self = this,
				$el = this.$el,
				d1 = new $.Deferred(),
				d2 = new $.Deferred();

			$el.html(this.template());

			// router totalPage set
			this.config = config().config;

			// config startPage 번호 in
			console.log("----------- startPage : ", this.config.startPage);
			theRouter().setRouterPage(this.config.startPage);
			// page 수가 over 되었을 경우 ---- 최초
			if (parseInt(this.config.totalPages, 10) < parseInt(theRouter().getRouterPage(), 10)) {
				// router page 갱신
				theRouter().setRouterPage(this.config.totalPages);
			}

			// hash check - #page/숫자로 접근시
			var checkHash = theRouter().checkHash();
			if (checkHash[0] === 'page' && _.isNumber(parseInt(checkHash[1]))) {
				theRouter().page(checkHash[0], checkHash[1]);
			}

			// router page move event add
			theRouter().on("route:page", _.bind(self.onRouterInPage, self));


			// window resize event 등록
			self.addWindowResizeEvent();

			// TABLElIST
			self.tableListSlider = require('scripts/views/TableList');

			// json load
			$.when(d1, d2).done(function(pages, contents) {
				self._initBook(pages, contents);
				self.addKeyEvent();
			});

			// page collection pages.json load
			var pages = new PagesCollection({
				model: new PageModel()
			});
			pages.fetch({
				success: function (pageData) {
					console.log('success page:', pageData);
					d1.resolve(pageData);

				},
				error: function (error) {
					console.log(error);
				}
			});

			// contents collection load
			var contents = new ContentsCollection({
				model: new ContentModel()
			});
			contents.fetch({
				success: function (contentData) {
					console.log('success content:', contentData);
					d2.resolve(contentData);
				},
				error: function (error) {
					console.log(error);
				}
			});


			// test bootstrap dialog
			//BootstrapDialog.show({
			//    message: 'Hi Apple!'
			//});
			/*
			 new WindowManager().open({
			 id: _.uniqueId('window'),
			 title: "테스트 윈도우",
			 bodyContent: $('<iframe src="http://dkdkdk.co.kr" style="width: 100%; height: 100%;"></iframe>'),
			 footerContent: '<button type="button" class="btn btn-default" data-dismiss="window">Close</button><button type="button" class="btn btn-primary">Submit</button>',
			 width: 800,
			 height: 400
			 });
			 */

		}
	});

	// 싱글톤 처리
	var instance;
	return function() {
		if(!instance) {
			instance = new MainBookView({
				el: $('#mainBook')
			});
		}
		return instance;
	};
});
