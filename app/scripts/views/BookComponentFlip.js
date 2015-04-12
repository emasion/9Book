/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'helper',
	'scripts/views/BookComponent',
	'scripts/models/Page',
	'scripts/views/Page',
	'scripts/routes/Router',
	'scripts/views/ZoomViewer'
], function(Backbone, JST, theHelper, BookComponentView, PageModel, PageView, theRouter, ZoomViewer) {
    'use strict';

	// BookComponent extend
	var BookComponentFlipView = BookComponentView.extend({
		template: JST['app/scripts/templates/BookComponent.ejs'],
		// go to page function
		gotoPage: function (param) {
			var self = this,
				$el = this.$el,
				page;

			if (_.isNumber(param) || _.isString(param)) {
				// page 일 경우
				//console.log("//////gotoPage:", param);
				page = parseInt(param, 10);
			} else if (_.isObject(param)) {
				// object 일 경우? event?
				//console.log(typeof param, param);
				page = 1;
			}
			// flip type 에 따라 다른 명령어

			// 현재 페이지와 다를 경우
			if(page !== this.$bookComponent.turn('page')) {
				this.$bookComponent.turn('page', page);
			}
		},

		prevPage: function () {
			var self = this;
			self.$bookComponent.turn("previous");
		},

		nextPage: function () {
			var self = this;
			self.$bookComponent.turn("next");
		},

		getView: function () {
			var self = this;
			return self.$bookComponent.turn('view');
		},

		zoom: function () {
			var self = this,
				$el = this.$el,
				page = self.$bookComponent.turn('page'),
				zoomEl = $el.find('.page-container[data-id=' + page + ']');

			var e = $.Event("dblclick");
			e.clientX = $(window).width() / 2;
			e.clientY = $(window).height() / 2;
			e.currentTarget = zoomEl;
			self.zoomModeStart(e);
		},

		render: function () {
			// 화면 구성
			var self = this,
				$el = this.$el,
				$bookComponent = $('#bookComponent');

			console.log('----------- Flip View Render -------------');
			console.log($bookComponent);

			if ($bookComponent.length < 1) {
				return;
			}

			self.$bookComponent = $bookComponent;

			// 초기 Page Instance
			self._setInitBookSize();
			self._setInitPages();
			self.createFlipBook();
			// Add mobile doubletap event
			if (MOBILE) {
				self.doubletapAddEvent($el.find('#bookComponent'));
			}
		},

		doubletapAddEvent: function (target) {
			var self = this;
			$(target).addSwipeEvents();
		},
		// 초기화 Book size
		_setInitBookSize: function () {
			var self = this,
				$el = this.$el,
				$bookComponent = this.$bookComponent,
				elHeight = theHelper().win.getHeight() - self.bookConfig.toolbarHeight;

			$($el).css({
				height: elHeight
			});

			var bookSize = this.getBookComponentSize($($el));
			$bookComponent.css({
				height: bookSize.height,
				width: bookSize.width
			});

			self.checkPageRadio();

			//$el.css({width: bookSize.width});
		},


		getBookComponentSize: function ($bookContainer) {
			var self = this,
				width,
				height,
				sizeNum = (self.bookConfig.bookSingle) ? 0.5 : 1,
				pageOriginWidth = self.bookConfig.bookWidth,            // 페이지 가로 넓이
				pageOriginHeight = self.bookConfig.bookHeight,            // 페이지 세로 넓이
				bookSizeRadio = self.bookConfig.bookSizeRadio,          // container 에 비례한 book size 비율
				containerWidth = $bookContainer.width(),
				containerHeight = $bookContainer.height(),
				originWidth,
				originHeight;

			if (this.bookConfig.bookSizeFix) {
				width = self.bookConfig.bookWidth * 2 * sizeNum;
				height = self.bookConfig.bookHeight;
			} else {
				originWidth = pageOriginWidth * 2 * sizeNum;
				originHeight = pageOriginHeight;

				//ebook너비 높이가 모두 컨테이너 너비 높이보다 작은 경우
				if (containerWidth > originWidth * sizeNum && containerHeight > originHeight) {
					if ((containerWidth - originWidth * sizeNum) / 2 > (containerHeight - originHeight) / 2) {
						//세로가 좁다 - 세로에 sizeRatio적용
						//console.log('세로가 좁다 - 세로에 sizeRatio적용');
						height = containerHeight * bookSizeRadio;
						width = (height * originWidth) / originHeight;
					} else {
						//가로가 좁다 - 가로에 sizeRatio적용
						//console.log('가로가 좁다 - 가로에 sizeRatio적용');
						width = containerWidth * bookSizeRadio;
						height = (width * originHeight) / originWidth * sizeNum;
					}
				} else {
					var nTempWidth = containerWidth / originWidth;
					var nTempHeight = containerHeight / originHeight;

					//너비 ,높이 비율값 가운데 큰 값이 기준
					if (nTempWidth > nTempHeight) {
						//기준값을 높이로
						//console.log('기준값을 높이로');
						height = containerHeight * bookSizeRadio;
						width = (height * originWidth) / originHeight;
						if (width > containerWidth * bookSizeRadio) { //넘어가면
							width = containerWidth * bookSizeRadio / sizeNum;
							height = (width * originHeight) / originWidth;
						}
					} else {
						//기준값을 너비로
						//console.log('기준값을 너비로');
						width = containerWidth * bookSizeRadio / sizeNum;
						height = (width * originHeight) / originWidth;
						if (height > containerHeight * bookSizeRadio) { //넘어가면
							height = containerHeight * bookSizeRadio;
							width = (height * originWidth) / originHeight;
						}
					}
				}
			}
			return {width: width, height: height};
		},
		// 초기화 Page Instance
		_setInitPages: function () {
			var self = this,
				$el = this.$el,
				$pageEl,
				$pageModel,
				createPages = [1, 2, self.collection.length - 1, self.collection.length],
				$bookComponent = this.$bookComponent,
				$depth = $('<div/>').addClass('depth');

			console.log(createPages);

			for (var i = 0; i < createPages.length; i = i + 1) {
				$pageEl = $('<div/>').addClass('book-page').addClass('p' + createPages[i]);

				// 표시 뒤, 뒷표지 앞
				if (i !== 0 || i !== createPages.length - 1) {
					if (this.bookConfig.innerSmallPage) {
						$pageEl.addClass('fixed');
					}
					// $pageEl.append($depth);

					// front-side
					if (i === 1) {
						$pageEl.addClass('front-side');
					}
					// back-side
					else if (i === createPages.length - 2) {
						$pageEl.addClass('back-side');
					}
				}

				if (this.bookConfig.hardCover || this.bookConfig.hardCoverAll) {
					$pageEl.addClass('hard');
				}

				$bookComponent.append($pageEl);
				$pageModel = this.collection.models[createPages[i] - 1];

				new PageView({
					model: $pageModel,
					el: $pageEl
				});
			}
		},

		createFlipBook: function () {
			var self = this,
				$el = this.$el,
				$mainBook = $('#mainBook'),
				createPages = [1, 2, self.collection.length - 1, self.collection.length],
				$bookComponent = this.$bookComponent;

			if ($bookComponent.width() === 0 || $bookComponent.height() === 0) {
				setTimeout(this.createFlipBook, 10);
				return;
			}

			$bookComponent.turn({
				//autoCenter: true,
				display: (self.bookConfig.bookSingle) ? 'single' : 'double',
				page: theRouter().getRouterPage(),
				gradients: self.bookConfig.gradients,
				acceleration: self.bookConfig.acceleration,
				duration: self.bookConfig.duration,
				inclination: self.bookConfig.inclination,
				elevation: self.bookConfig.elevation,
				pages: self.collection.length,
				when: {
					turning: _.bind(self.turningFlip, self),
					turned: _.bind(self.turnedFlip, self),
					missing: _.bind(self.missingPage, self),
					start: _.bind(self.startFlip, self),
					end: _.bind(self.endFlip, self)
				}
			});

			// contents load
			createPages.forEach(function(page) {
				self.addContent(page);
			});


			// Zoom.js
			$el.zoom({
				flipbook: $bookComponent,
				max: function () {
					return 3000 / $('.magazine').width();
				},
				when: {
					changing: function (event, newZoom, oldZoom) {
						console.log('$$$$ zoom changing!!');
					},
					scrolling: function (event, left, top) {
						console.log('$$$$ zoom scrolling!!');
					},
					swipeLeft: function () {
						console.log('$$$$ zoom swipeLeft!!');
					},
					swipeRight: function () {
						console.log('$$$$ zoom swipeRight!!');
					},
					resize: function (event, scale, page, pageElement) {
						console.log('$$$ resize zoom');
						if (scale === 1) {
							//loadSmallPage(page, pageElement);
						}else {
							//loadLargePage(page, pageElement);
						}
					},
					zoomIn: function () {
						$bookComponent.addClass('zoom-in');
						if (!window.escTip && !$.isTouch) {
							//escTip = true;
							$('<div />', {'class': 'exit-message'}).
								html('<div>Press ESC to exit</div>').
								appendTo($('body')).
								delay(2000).
								animate({opacity: 0}, 500, function () {
									$(this).remove();
								});
						}
					},
					zoomOut: function () {
						//$('.exit-message').hide();
						//$('.thumbnails').fadeIn();
						//$('.made').fadeIn();
						//$('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');
						setTimeout(function () {
							$bookComponent.removeClass('zoom-in');
							self.resizeViewport();
						}, 0);
					}
				}
			});

			//memory에 보관할 임시 페이지 수 지정
			$bookComponent.turn('range', 4);
			$bookComponent.turn('resize');

			self.resizeViewport();
			self.turnCenter(theRouter().getRouterPage());

		},
		// 페이지 넘김중
		turningFlip: function (e, page, view) {
			theHelper().debugger.console('____________________ turning Flip ', e);
			var self = this,
				$bookComponent = this.$bookComponent,
				size = $bookComponent.turn('size');

			//  hash 변경

			theRouter().hashPageChange(page);

			// 이동 제한
			/*
			if (page > 3 && page < totalPages - 3) {
				if (page === 1) {
					$bookComponent.turn('page', 2).turn('stop').turn('page', page);
					e.preventDefault();
					return;
				} else if (page === totalPages) {
					$bookComponent.turn('page', totalPages - 1).turn('stop').turn('page', page);
					e.preventDefault();
					return;
				}
			} else if (page > 3 && page < totalPages - 3) {
				if (page === 1) {
					$bookComponent.turn('page', 2).turn('stop').turn('page', page);
					e.preventDefault();
					return;
				} else if (page === totalPages) {
					$bookComponent.turn('page', totalPages - 1).turn('stop').turn('page', page);
					e.preventDefault();
					return;
				}
			}
			*/

			self.turnCenter(page);
			//self.disableControls(page);
			self.turningEventTrigger({
				event: e,
				page: page,
				view: view
			});
		},
		// 페이지 넘김 끝
		turnedFlip: function (e, page, view) {
			theHelper().debugger.console('____________________ turned Flip ', e);

			var self = this,
				$bookComponent = this.$bookComponent;

			self.disableControls(page);
			self.turnedEventTrigger({
				event: e,
				page: page,
				view: view
			});

			if (page === 1) {
				$bookComponent.turn('peel', 'br');
			}
		},

		turnCenter: function(page) {
			var self = this,
				$el = this.$el,
				$bookComponent = this.$bookComponent,
				size = $bookComponent.turn('size'),
				totalPages = $bookComponent.turn('pages');

			if(MOBILE) {
				return;
			}

			var left;
			if(page === 1) {
				left = - size.width / 4;
			}else if(page === totalPages) {
				left = size.width / 4;
			}else {
				left = 0;
			}

			$bookComponent.stop().animate({
				left: left
			}, 200);
		},

		turningEventTrigger: function (args) {
			var self = this;
			self.trigger('TURNING_FLIP', args);
		},

		turnedEventTrigger: function (args) {
			var self = this;
			self.trigger('TURNED_FLIP', args);
		},
		// 첫, 마지막 페이지 버튼 세팅
		disableControls: function (page) {
			var self = this;
		},
		// 없는 페이지
		missingPage: function (e, pages) {
			var self = this;
			theHelper().debugger.console('____________________ missing Page ', e, pages);

			for (var i = 0; i < pages.length; i++) {
				self.addPage(pages[i]);
				self.addContent(pages[i]);
			}
		},
		// 페이지 추가
		addPage: function (page) {
			var self = this,
				$bookComponent = this.$bookComponent,
				totalPages = $bookComponent.turn('pages');

			var $pageEl = $('<div/>').addClass('book-page').addClass('p' + page);
			var $pageModel;

			// 표시 뒤, 뒷표지 앞
			if (self.bookConfig.innerSmallPage) {
				$pageEl.addClass('fixed');
			}
			// $pageEl.append($depth);

			// front-side
			if (page === 2) {
				$pageEl.addClass('front-side');
			}
			// back-side
			else if (page === totalPages - 1) {
				$pageEl.addClass('back-side');
			}

			if (self.bookConfig.hardCover && (page === 1 || page === 2 || page === totalPages - 1 || page === totalPages)) {
				$pageEl.addClass('hard');
			}

			if (self.bookConfig.hardCoverAll) {
				$pageEl.addClass('hard');
			}

			$pageModel = self.collection.models[page - 1];
			new PageView({
				model: $pageModel,
				el: $pageEl
			});

			// Add the page to the flipbook
			$bookComponent.turn('addPage', $pageEl, page);
		},

		// flip start - 플립이 들려 올려올 때
		startFlip: function (e) {
			var self = this,
				$bookComponent = this.$bookComponent;
			theHelper().debugger.console('____________________ start Flip ', e);

		},
		// flip end
		endFlip: function (e) {
			theHelper().debugger.console('____________________ end Flip ', e);
		},
		// viewport resize handler
		resizeViewport: function (e) {
			var self = this,
				$el = this.$el,
				$bookComponent = this.$bookComponent,
				options = $bookComponent.turn('options');

			$el.css({
				height: theHelper().win.getHeight() - self.bookConfig.toolbarHeight
			}).zoom('resize');

			if ($bookComponent.turn('zoom') === 1) {
				var bookSize = this.getBookComponentSize($($el));
				if (bookSize.width !== $bookComponent.width() || bookSize.height !== $bookComponent.height()) {
					$bookComponent.turn('size', bookSize.width, bookSize.height);
					// 1페이지일 경우
					if ($bookComponent.turn('page') === 1) {
						$bookComponent.turn('peel', 'br');
					}
				}

				self.checkPageRadio();
			}
		},
		// zoom view 생성
		zoomModeStart: function (e) {
			var self = this,
				$el = this.$el,
				$bookComponent = this.$bookComponent;

			setTimeout(function () {
				if ($el.zoom('value') === 1) {
					// book container hide
					$('#bookContainer').hide();
					//$el.zoom('zoomIn', e);
					var mouseClickPoint = self.getClickMousePoint(e);
					var zoomViewer = new ZoomViewer().open({
						clickX: mouseClickPoint.mouseX,             // page 의 마우스 클릭 좌표 X
						clickY: mouseClickPoint.mouseY,             // page 의 마우스 클릭 좌표 Y
						currentPage: $bookComponent.turn('view'),   // Zoom 할 페이지 정보
						bookConfig: self.bookConfig,               // Zoom 할 기본 스케일
						pageCollection: self.pagesCollection,     // PAGE MODEL
						closeCallback: function (param) {                      // close callback
							//zoomViewer.unbind();
							//zoomViewer.remove();
							self.zooming = false;
							$('#bookContainer').show();
						}
					});
					self.zooming = true;
				}
			}, 1);
		},
		events: function () {
			return MOBILE ?
			{
				"doubletap": 'zoomModeStart'
			} :
			{
				"dblclick .page-container": 'zoomModeStart'
			};
		}
	});

	return BookComponentFlipView;

});
