/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/models/Bookmark'
], function(Backbone, JST, BookmarkModel) {
    'use strict';

	var BookmarkContainer = Backbone.View.extend({
		MAX_BOOKMARK: 1,
		marginLeft: 120,
		mode: 'last',   // last - 제일 마지막 북마크한 아이템만 기억, all - 페이지당 북마크를 추가할 수 있음(화면 구현 시나리오는 미정)
		resizeTarget: null,
		bookmarkLoaded: false,
		events: {
		},

		onBookmarkClickHandler: function(e) {
			var self = this,
				$el = this.$el,
				$bookmark = $(e.currentTarget),
				view = self.getViewCallback();

			// 현재 보이는 페이지일 경우
			var clickPage = parseInt($(e.currentTarget).attr('data-id'), 10);
			view.forEach(function(page) {
				if(clickPage === page) {
					self.changeBookmark(clickPage);
				}
			});
		},

		getBookmarkItem: function(args) {
			var self = this,
				$el = this.$el,
				$bookComponent = self.bookComponent,
				page = _.isNumber(args) ? args : args.page;

			return $bookComponent.find('.bookmark-item[data-id=' + page + ']');
		},

		isAddedBookmark: function(page) {
			var self = this,
				$el = this.$el,
				$bookComponent = self.bookComponent;

			return (self.getBookmarkItem(page).length > 0) ? true : false;
		},

		// 이동되는 페이지의 bookmark 표시를 확인하고 삭제하던지 등록한다.
		turningFlipHandler: function(args) {
			var self = this,
				$el = this.$el;

			if(!args || !args.view) {
				return;
			}
			self.checkBookmarkHandler(args.view);
		},
		// 이동후 앞뒤 페이지의 bookmark 표시를 확인하고 삭제하던지 등록한다.
		turnedFlipHandler: function(args) {
			var self = this,
				$el = this.$el;

			if(!args || !args.view) {
				return;
			}

			var checkPages = [];
			args.view.forEach(function(page) {
				checkPages.push(page - 2);
				checkPages.push(page - 1);
				checkPages.push(page + 1);
				checkPages.push(page + 2);
			});

			checkPages = _.uniq(checkPages);
			checkPages = _.difference(checkPages, [-2, -1, 0, self.totalPages + 1, self.totalPages + 2]);
			checkPages = _.difference(checkPages, args.view);
			//console.log(checkPages);

			self.checkBookmarkHandler(checkPages);
		},

		checkBookmarkHandler: function(pages) {
			var self = this;
			pages.forEach(function(page) {
				self.bookmarkModel.getItem(page).then(function(data, status) {
					if(status === 'success' && !_.isUndefined(status)) {
						// 북마크가 추가 되어있다.(db상에) - 확면상에 추가되있는지 확인
						if(!self.isAddedBookmark(data.page)) {
							// 안되있으므로 추가
							self.addBookmarkItem(data);
						}else {
							// 되있으면 event binding
							self.addClickEvent(data);
						}
					} else {
						// 북마크가 등록 안되어 있다(db에) - 화면상에 있으면 삭제
						if(self.isAddedBookmark(page)) {
							self.removeBookmarkItem(page);
						}
					}
				});
			});
		},

		addBookmarkItem: function(data) {
			var self = this,
				$bookComponent = self.bookComponent,
				page = data.page,
				dateStr = moment(data.addDate).format('LL'),
				$bookmarkItem = $('<div/>').addClass('bookmark-item').attr('data-id', page)
					.append('<a href="#page/' + page + '"><span class="bookmark-button" title="' + dateStr + '">' + page + '</span></a>');

			// last mode 일 경우는 모든 bookmark-item 삭제
			if (self.mode === 'last') {
				$bookComponent.find('.bookmark-item').remove();
			}

			$bookComponent.find('div.page-wrapper[page="' + page + '"]').find('.page').prepend($bookmarkItem);
			// bookmark item setPosition
			self.setPosition($bookmarkItem, self.findPosition(page, data.view));
			// bookmark item event add
			self.addClickEvent(page);
		},

		addClickEvent: function(page) {
			var self = this;
			var $bookmarkItem = self.getBookmarkItem(page);
			if($bookmarkItem.length > 0) {
				$bookmarkItem.on(MOBILE ? 'touchstart' : 'click', _.bind(self.onBookmarkClickHandler, self));
			}
		},

		bookmarkLoadStart: function() {
			var self = this;
			self.bookmarkModel.loadFromDB().then(function(bookmarkPages) {
				self.bookmarkLoaded = true;
				bookmarkPages.forEach(function (data) {
					self.addBookmarkItem(data.value);
				});
			});
		},

		changeBookmark: function(args) {
			var self = this,
				pageIndex = (typeof args === 'number') ? args : args.page;

			self.bookmarkModel.changeBookmark({
				page: pageIndex,
				view: self.getViewCallback()
			}).then(function (data, status) {
				_.extend(data, {page: pageIndex});
				if (status === 'success') {
					// 삭제됨
					self.removeBookmarkItem(pageIndex);
				} else {
					// 추가됨
					self.addBookmarkItem(data);
				}
			});
		},

		findPosition: function(itemPage, checkView) {
			var self = this,
				position = 'left';

			// 비교
			$.each(checkView, function(i, page) {
				// 1페이지는 right 적용되어야 함
				if(page === 1 && checkView.length > 1) {
					position = 'right';
				}
				// 마지막 페이지는 left 적용되어야 함
				else if(page === self.totalPages && checkView.length > 1) {
					position = 'left';
				}
				//
				else if(page === itemPage) {
					position = (i === 0) ? 'left' : 'right';
				}
			});
			return position;
		},

		setPosition: function($bookmarkItem, position) {
			var self = this,
				$el = this.$el;

			var target = $bookmarkItem,
				value = self.marginLeft;

			target[0].style.left = "";
			target[0].style.right = "";

			if(position === 'left') {
				target.css({
					left : value
				});
			}else {
				target.css({
					right : value
				});
			}
		},

		removeBookmarkItem: function(page) {
			var self = this,
				$bookComponent = self.bookComponent;
			$bookComponent.find('.bookmark-item[data-id=' + page + ']').off().remove();
		},

		init: function(options) {
			var self = this;
			self.mode = options.mode;
			self.bookComponent = options.bookComponent;
			self.totalPages = options.totalPages;
			self.getViewCallback = options.getViewCallback;
			self._initDo();
		},

		_initDo: function() {
			var self = this;
			self.bookmarkModel = new BookmarkModel();
			self.bookmarkModel.on('TRANSACTION_COMPLETED', _.bind(self.bookmarkLoadStart, self));
			self.bookmarkModel.init({
				mode: self.mode,
				bookId: 'softbook001'
			});
		},

		initialize: function() {
			var self = this,
				$el = this.$el;
		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new BookmarkContainer();
			return instance;
		}
		return instance;
	};
});
