/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'helper',
	'scripts/views/Page',
	'scripts/views/Content',
], function(Backbone, JST, theHelper, PageView, ContentView) {
    'use strict';

	var ZoomViewer = Backbone.View.extend({
        template: JST['app/scripts/templates/ZoomViewer.ejs'],
		isZoomMode: false,
		zoomSlider: null,
		options: {
			clickX: 0,             // page 의 마우스 클릭 좌표 X
			clickY: 0,             // page 의 마우스 클릭 좌표 Y
			currentPage: 1,        // Zoom 할 페이지 정보
			bookConfig: null,
			pageCollection: null,
			closeCallback: null
		},
		getViewMode: function () {
			var self = this;
			self.viewPages = String(self.options.currentPage).split(',');
			if(self.options.bookConfig.bookSingle || self.viewPages.length === 1 || self.viewPages[0] === '0' || self.viewPages[1] === '0') {
				return 'single';
			}
			return 'double';
		},

		open: function(options) {
			var self = this,
				$el = this.$el;
			self.options = options;

			if(self.isZoomMode) {
				return;
			}
			if(_.isUndefined(options)) {
				return;
			}

			// page size 정보
			self.loadPageData();
			// image load - zoom 좌표값
			self.zoomViewerLoad();
			$el.show();
			$el.focus();
		},
		//page 정보 만들기
		loadPageData: function () {
			var self = this;
			/* load page data */
			self.zoomPanWidth = self.options.bookConfig.bookWidth;
			self.zoomPanHeight =  self.options.bookConfig.bookHeight;
			self.zoomDefault = self.options.bookConfig.zoomData.pageZoomDefault;
			self.zoomMax = self.options.bookConfig.zoomData.pageZoomMax;
			self.zoomMin = self.options.bookConfig.zoomData.pageZoomMin;
			self.mode = self.getViewMode();
			self.divWidth = (self.mode === "single") ? self.zoomPanWidth : (self.zoomPanWidth * 2);
			self.divHeight = self.zoomPanHeight;
		},
		// load
		zoomViewerLoad: function() {
			var self = this,
				$el = this.$el,
				$pageZoomControl = $('#pageZoomControl');

			self.currentScale = self.zoomDefault;
			self.pinch = false;

			//zoomDefault scale - click point 적용
			var _initScaleRadio;
			if(self.mode === "single") {
				_initScaleRadio =  parseInt(self.divWidth / self.zoomPanWidth, 10) * self.currentScale;
			}else{
				_initScaleRadio =  parseInt((self.divWidth / 2) / self.zoomPanWidth, 10) * self.currentScale;
			}
			console.log('[click]', self.options.clickX, self.options.clickY);

			self.options.clickX = self.options.clickX * _initScaleRadio;
			self.options.clickY = self.options.clickY * _initScaleRadio;
			self._X = (theHelper().win.getWidth() - self.divWidth) / 2 - self.options.clickX;
			self._Y = (theHelper().win.getHeight() - self.divHeight) / 2 - self.options.clickY;
			self.bePoint = null;
			self.currentPoint = [self._X, self._Y];
			/* load page data */

			console.log('[point]', self.currentPoint);

			// render
			//self.xmlData = self.proxy.getPages();
			self.pageRender();
			self.controllRender();
		},

		pageRender: function() {
			//생성 - 마우스 줌 위치 계산해서 left, top값 연결
			var self = this,
				$zoomBox = $("#zoomBox").css({
					width: self.divWidth,
					height: self.divHeight,
					left: self.currentPoint[0],
					top: self.currentPoint[1]
				});

			$zoomBox.children().remove();

			var $pageBox = $("<div/>").addClass('zoom-viewer-page').css({
				width: self.zoomPanWidth,
				height: self.zoomPanHeight
			});

			var $pageBox2 = $("<div/>").addClass('zoom-viewer-page-right').css({
				width: self.zoomPanWidth,
				height: self.zoomPanHeight
			});

			var page = (self.viewPages[0] === "0") ? parseInt(self.viewPages[1], 10) : parseInt(self.viewPages[0], 10);
			$zoomBox.append($pageBox);
			self.addPageData($pageBox, page);

			if(self.mode === "double"){
				var page2 = (self.viewPages[1] === "0") ? parseInt(self.viewPages[0], 10) : parseInt(self.viewPages[1], 10);
				$zoomBox.append($pageBox2);
				self.addPageData($pageBox2, page2);
			}

			// 스케일 적용
			self.setScaleView(self.zoomDefault);

			//add bind
			self.addDragBind();
			self.addMouseWheelBind();
			if(MOBILE) { self.doubletapAddEvent(); }
		},

		doubletapAddEvent: function() {
			var self = this,
				$el = this.$el;
			$el.addSwipeEvents();
		},
		//page data 추가
		addPageData: function($pageBox, page) {
			var self = this;
			var $pageModel = self.options.pageCollection.models[page - 1];
			var $bgImg;
			var url;

			$bgImg = $("<div/>").addClass('zoom-viewer-bgimg');
			$bgImg.css({
				width: self.zoomPanWidth,
				height: self.zoomPanHeight
			});

			$pageBox.append($bgImg);

			new PageView({
				model: $pageModel,
				el: $bgImg
			});

			self.addContent($pageBox, page)

			/*

			//bgground img
			if (pageData.attr('source')) {
				bgImg = $("<span/>").addClass('zoom-viewer-bgimg');
				url = pageData.attr('source');
				bgImg.css({
					width: self.zoomPanWidth,
					height: self.zoomPanHeight,
					'background-image': 'url(' + url + ')',
					'background-size': self.zoomPanWidth + "px " + self.zoomPanHeight + "px",
					display: "block"
				});

			} else {
				bgImg = $("<span/>").addClass('zoom-viewer-bgimg');
				url = "images/lackpage.jpg";
				bgImg.css({
					width: self.zoomPanWidth,
					height: self.zoomPanHeight,
					'background-image': 'url(' + url + ')',
					'background-size': self.zoomPanWidth + "px " + self.zoomPanHeight + "px",
					display: "block"
				});
				parent.append(bgImg);
			}

			//contents loader
			var contentsContainer = $("<div/>").addClass('zoom-contents-container').attr({'page': page}).css({
				width: self.zoomPanWidth,
				height: self.zoomPanHeight
			});

			if (pageData.children().length > 0) {
				parent.append(contentsContainer);
				//contentsRender(contentsContainer, pageData);
				// TODO : 컨텐츠 렌더 추가
			}
			*/
		},

		addContent: function ($pageBox, page) {
			var self = this;

			var $pageContainer = $pageBox.find('.page-container[data-id=' + page + ']');
			var $contentContainer = $pageContainer.find('.content-container');
			var contentViewInstance;

			if($contentContainer.data('contentView')) {
				contentViewInstance = $contentContainer.data('contentView');
			}else {
				contentViewInstance = new ContentView({
					el: $contentContainer
				});
				$contentContainer.data('contentView', contentViewInstance);
			}

			contentViewInstance.render(page);
		},

		addDragBind: function () {
			//터치 및 마우스 컨트롤에 대한 이벤트 연결
			var self = this,
				$el = this.$el,
				isTouch = $.isTouch,
				dragHandle = $("#dragHandle");

			self.mouseEvents = (isTouch) ? {touchstart: 'touchstart',touchmove: 'touchmove',touchend: 'touchend'} : {touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup'};
			self._touchActive = false;

			if(theHelper().Browser.msie) {
				$el[0].addEventListener(self.mouseEvents.touchstart, function(event) {
					self._touchActive = true;
					return self.mouseDown(theHelper().uiEvent.makeMouseEvent(event));
				});
			}

			dragHandle.on( self.mouseEvents.touchstart, function(event) {
				self._touchActive = true;
				return self.mouseDown(theHelper().uiEvent.makeMouseEvent(event));
			});

			// these delegates are required to keep context
			self._mouseMoveDelegate = function(event) {
				if (self._touchActive) {
					return self.mouseMove(theHelper().uiEvent.makeMouseEvent(event));
				}
			};
			self._mouseUpDelegate = function(event) {
				if (self._touchActive) {
					self._touchActive = false;
					return self.mouseUp(theHelper().uiEvent.makeMouseEvent(event));
				}
			};

			if(theHelper().Browser.msie) {
				$el[0].addEventListener(self.mouseEvents.touchmove, self._mouseMoveDelegate);
				$el[0].addEventListener(self.mouseEvents.touchend, self._mouseUpDelegate);
				$el[0].addEventListener("mouseout", self._mouseUpDelegate);
			}else{
				dragHandle.on(self.mouseEvents.touchmove, self._mouseMoveDelegate).on(self.mouseEvents.touchend, self._mouseUpDelegate).on("mouseout", self._mouseUpDelegate);
			}
		},

		// event handler
		mouseDown: function(event) {
			var self = this,
				$el = this.$el,
				isTouch = $.isTouch,
				dragHandle = $("#dragHandle"),
				controller = $("#pageZoomControl");

			if(isTouch && event.originalEvent.touches.length > 1) {
				return;
			}
			/* start drag event*/
			// controller hide
			controller.hide();

			dragHandle.addClass("zoom_drag_cursor");
			if(theHelper().Browser.msie) {
				dragHandle[0].style.removeProperty("cursor");
				dragHandle.css({cursor:'url("images/grab.cur"), auto'});
			}
			self.bePoint = [event.clientX, event.clientY];
		},

		mouseUp: function(event) {
			var self = this,
				$el = this.$el,
				isTouch = $.isTouch,
				dragHandle = $("#dragHandle"),
				controller = $("#pageZoomControl");

			// controller hide
			controller.show();

			dragHandle.removeClass("zoom_drag_cursor");
			if(theHelper().Browser.msie) {
				dragHandle[0].style.removeProperty("cursor");
				dragHandle.css({cursor:'url("images/hand.cur"), auto'});
			}

			self.tweenView();
		},

		tweenView: function() {
			var self = this;
			var zoomBox = $('#zoomBox');
			var movingGuide = self.getMovingGuide(self.currentPoint[0], self.currentPoint[1]);
			TweenLite.to(zoomBox, 0.3, {left: movingGuide[0], top: movingGuide[1], ease: Back.easeOut});

			self.currentPoint = [movingGuide[0], movingGuide[1]];
			self.bePoint = null;
			self.pinch = false;
		},

		mouseMove: function(event) {
			var self = this,
				$el = this.$el,
				isTouch = $.isTouch,
				dragHandle = $("#dragHandle"),
				zoomBox = $('#zoomBox');

			if(!self.bePoint) {
				return;
			}
			if(self.pinch) {
				return;
			}

			if(isTouch && event.originalEvent.touches.length > 1) {
				return;
			}

			var currentX = parseInt(zoomBox.css('left'), 10);
			var currentY = parseInt(zoomBox.css('top'), 10);

			var moveX = (event.clientX - self.bePoint[0]);
			var moveY = (event.clientY - self.bePoint[1]);

			var affterX = currentX + moveX;
			var affterY = currentY + moveY;

			zoomBox.css({
				left: affterX,
				top: affterY
			});

			self.bePoint = [event.clientX, event.clientY];
			self.currentPoint = [affterX, affterY];

		},

		getMovingGuide: function(_x, _y) {
			var self = this,
				$el = this.$el,
				isTouch = $.isTouch,
				dragHandle = $("#dragHandle"),
				zoomBox = $('#zoomBox');

			var _pageLength = zoomBox.contents().length;
			var _scale = self.currentScale;
			var _width = parseInt(zoomBox.css('width'), 10) / 2;
			var _height = parseInt(zoomBox.css('height'), 10) / 2;
			var _winWidth = theHelper().win.getWidth() * (_pageLength - 1);
			var _winHeight = theHelper().win.getHeight();
			var scaleWidth = (_scale - 1) * _width;
			var scaleHeight = (_scale - 1) * _height;

			var outX = _x;
			var outY = _y;

			if(parseInt(zoomBox.css('height'), 10) * _scale < _winHeight) {
				//viewer가 창보다 작을때
				outY = (scaleHeight + (_winHeight - ((_scale + 1) * parseInt(zoomBox.css('height'), 10) / 2))) / 2;
			}else{
				if(scaleHeight - outY < 0){
					outY = scaleHeight;
				}else if(outY < -((_scale + 1) * parseInt(zoomBox.css('height'), 10) / 2) + _winHeight) {
					outY = _winHeight - ((_scale + 1) * parseInt(zoomBox.css('height'), 10) / 2);
				}
			}

			if(parseInt(zoomBox.css('width'), 10) * _scale < theHelper().win.getWidth()) {
				outX = ((theHelper().win.getWidth() - parseInt(zoomBox.css('width'), 10) * _scale) / 2) + scaleWidth;
			}else{
				var rightGuide = parseInt(-(parseInt(zoomBox.css('width'), 10) - theHelper().win.getWidth()) - scaleWidth, 10) - 1;

				if(scaleWidth - outX < 0){ //left
					outX = scaleWidth;
				}else if(_pageLength === 2  && rightGuide > parseInt(zoomBox.css('left'), 10)) { //right one
					outX = -(parseInt(zoomBox.css('width'), 10) * _scale - theHelper().win.getWidth()) + scaleWidth;
				}else if(_pageLength === 1  && rightGuide > parseInt(zoomBox.css('left'), 10)) { //right one
					outX = -(parseInt(zoomBox.css('width'), 10) * _scale - theHelper().win.getWidth()) + scaleWidth;
				}else{
					if(rightGuide > outX){
						outX = outX + (rightGuide - outX);
					}
				}
			}
			return [outX, outY];
		},
		// 줌 뷰에 스케일 적용
		setScaleView: function(scale) {
			var self = this,
				$dragHandle = $("#dragHandle"),
				$zoomBox = $('#zoomBox'),
				$zoomSlider = $('#zoomPageSlider'),
				point = null,
				originPoint = null;

			scale = Math.round(scale * 10) / 10

			if(self.zoomMin > scale || self.zoomMax < scale) {
				return;
			}

			self.currentScale = scale;

			// 슬라이더에 스케일 값 적용
			if(self.zoomSlider) {
				self.zoomSlider.slider('setValue', scale);
			}

			var scaleXY = "scale(" + scale + "," + scale + ")";
			$zoomBox.css({"transform": scaleXY});
			$zoomBox.css({"-ms-transform": scaleXY});
			$zoomBox.css({"-webkit-transform": scaleXY});
			$zoomBox.css({"-o-transform": scaleXY});
			$zoomBox.css({"-moz-transform": scaleXY});

			// zoom css 적용
			//$zoomBox.css('zoom', scale);

			// 무빙 가이드 적용
			var movingGuide = self.getMovingGuide(self.currentPoint[0], self.currentPoint[1]);
			//console.log('guide : ', movingGuide[0], movingGuide[1]);

			$zoomBox.css({
				left: movingGuide[0],
				top: movingGuide[1]
			});

			// 현재 포인트 저장
			self.currentPoint = [movingGuide[0], movingGuide[1]];
		},

		controllRender: function() {
			var self = this,
				$el = this.$el,
				$dragHandle = $("#dragHandle"),
				$zoomSlider = $('#zoomPageSlider');

			//add bind
			self.addControllBind();
			self.addKeyBind();
			if(MOBILE) {
				$dragHandle.on('touchy-pinch', _.bind(self.handleTouchyPinch, self));
			}

			$zoomSlider.focus();
		},

		addControllBind: function() {
			var self = this,
				$el = this.$el,
				$zoomBox = $('#zoomBox'),
				$zoomSlider = $('#zoomPageSlider'),
				$closeBtn = $el.find('[data-id=btnZoomClose]');

			self.zoomSlider = $zoomSlider.slider({
				value: self.zoomDefault,
				min: self.zoomMin,
				max: self.zoomMax,
				step: 0.1,
				formater: function (value) {
					return Math.round(value * 10) / 10
				}
			}).on('slide', function(e) {
				self.setScaleView(Math.round(e.value / 0.1) * 0.1);
			}).on('slideStop', function(e) {
				console.log('slider stop!');
			});
		},

		/*contentsRender: function(pageContainer, pageNode) {
			var length, xmlPageNumber, nodeName, Component, strComponent, isContetns,
				containerNumber = parseInt(pageContainer.attr('page'));

			try{
				length = pageNode.children().length;
				xmlPageNumber = parseInt(pageNode.attr("id"));
			}catch(e){
				length = 0;
				xmlPageNumber = 'someId';
			}

			//xml상의 page id와 container id가 같은 때 추가
			if(containerNumber === xmlPageNumber){
				for(var i=0; i<length; i++)
				{
					nodeName = pageNode.children()[i].nodeName;
					//console.log(pageNode);

					isContetns = $(pageContainer).find('#' + pageNode.children()[i].getAttribute("id"));

					//console.log("nodeName:",nodeName,containerNumber);

					if(isContetns.length === 0) {
						strComponent = "window.Application.Ebook.Components." + nodeName;
						try
						{
							Component = theHelper().stringToClass(strComponent);
							var instance = new Component();
							instance.initialize(pageContainer, pageNode.children()[i], 1);
							instance.render();
							instance = null;
						}
						catch(e)
						{
							//alert(strComponent+" not found!");
							//console.log(strComponent+" - not found!")
						}
					}
				}
			}

			length = null;
			nodeName = null;
			strComponent = null;

			containerNumber = null;
			xmlPageNumber = null;
			isContetns = null;
		},*/

		addMouseWheelBind: function() {
			var self = this;
			var target = $('#dragHandle');
			if($.isTouch) {
				return;
			}
			target.on('mousewheel', function(e) {
				var delta = theHelper().uiEvent.getWheelDelta(e.originalEvent),
					dt = e.timeStamp - (this.mouseWheelStartTime || 0);

				if (dt < 30) {
					return;
				}

				this.mouseWheelStartTime = e.timeStamp;

				//console.log('delta:'+delta);
				var currentScale = self.currentScale;
				if (delta < 0) {
					currentScale = currentScale - 0.2;
				}
				else if (delta > 0) {
					currentScale = currentScale + 0.2;
				}
				//console.log("mousePoint:"+mousePoint[0],mousePoint[1]);
				self.setScaleView(currentScale);
			});
		},

		handleTouchyPinch: function(e, $target, data) {
			//BootstrapDialog.show({
			//    message: data
			//});
			var self = this;
			self.gapScale = data.scale - data.previousScale;
			var scale =  self.currentScale + self.gapScale;
			self.pinch = true;
			self.setScaleView(scale);
		},

		addKeyBind: function(e) {
			var self = this,
				$el = this.$el;
			$(document).off('keydown.zoomviewer');
			$(document).on("keydown.zoomviewer", function(e) {
				var currentScale = self.currentScale;
				var moveValue = 20;
				var moveX = 0;
				var moveY = 0;
				var scaleValue = 0.2;

				if(e.shiftKey) {
					if(e.keyCode === 37 || e.keyCode === 39) {
						switch (e.keyCode) {
							case 37:    //left
								currentScale = currentScale - 0.2;
								break;
							case 39:    //right
								currentScale = currentScale + 0.2;
								break;
						}
						self.setScaleView(currentScale);
					}
				}else {
					switch (e.keyCode) {
						case 37:    //left
							moveX = moveValue;
							break;
						case 38:    //up
							moveY = moveValue;
							break;
						case 39:    //right
							moveX = -moveValue;
							break;
						case 40:    //down
							moveY = -moveValue;
							break;
						case 32:    //space - zoom end
						case 27:    //esc - zoom end
							self.closeZoomViewer();
							return;
					}
				}
				self.keyMoving(moveX, moveY);
				e.preventDefault();
				return false;
			});
		},

		keyMoving: function(left, top) {
			var self = this;
			var currentX = parseInt($('#zoomBox').css('left'));
			var currentY = parseInt($('#zoomBox').css('top'));

			var moveX = left;
			var moveY = top;

			var affterX = currentX+moveX;
			var affterY = currentY+moveY;

			var movingGuide = self.getMovingGuide(affterX,affterY);
			affterX = movingGuide[0];
			affterY = movingGuide[1];

			$('#zoomBox').css({
				left: affterX,
				top: affterY
			});

			//self.bePoint = [event.clientX,event.clientY];
			self.currentPoint = [affterX, affterY];
		},
		// zoom mode 닫기
		closeZoomViewer: function() {
			var self = this,
				$el = this.$el;
			// 초기화 및 el hide
			if(self.options.closeCallback) {
				self.options.closeCallback({

				});
			}
			$el.hide();
		},

		events: function() {
			return MOBILE ?
			{
				'touchstart [data-id=btnZoomClose]': 'closeZoomViewer',
				'doubletap': 'closeZoomViewer',
				'keydown': 'addKeyBind'
			} :
			{
				'click [data-id=btnZoomClose]': 'closeZoomViewer',
				'dblclick': 'closeZoomViewer',
				'keydown': 'addKeyBind'
			};
		},

        initialize: function() {
            // TODO : Page 화면 구성
			var self = this,
				$el = this.$el;

			$el.html(this.template());

			// window resize event add
			$(window).resize(function(e) {
				self.tweenView();
			}).bind('orientationchange', function(e) {
				self.tweenView();
			});
        },
		render: function() {
			// 화면 구성
		}
    });

	// 싱글톤 처리
	var instance;
	return function() {
		if(!instance) {
			instance = new ZoomViewer({
				el: $('#zoomViewer')
			});
		}
		return instance;
	};
});
