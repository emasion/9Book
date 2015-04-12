/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'helper',
	'scripts/routes/Router',
	'scripts/views/ZoomViewer',
	'scripts/views/Content',
	'scripts/models/Config'
], function(Backbone, JST, theHelper, theRouter, zoomViewer, ContentView, config) {
    'use strict';

    return Backbone.View.extend({
		template: JST['app/scripts/templates/BookComponent.ejs'],
		//template: 'app/scripts/templates/BookComponent.html',
		pageRadio: 1,
		zooming: false,
		pagesCollection: null,
		bookConfig: {},
		/*bookConfig: {
		 bookSizeFix: false,           // book size 고정 여부
		 bookSizeRadio: 0.9,
		 sizeRadio: [4, 5],            // page 가로 / 세로 사이즈 비율
		 bookWidth: 400,
		 bookHeight: 500,
		 hardCover: false,              // hard cover
		 hardCoverAll: false,          // 전체 페이지 hard cover
		 innerSmallPage: false,        // inner page small 사이즈
		 innerSmallPageMargin: 10,     // inner page small 사이즈 margin
		 bookSideDepth: false,          // 북 사이드 두께감
		 gradients: true,
		 acceleration: !theHelper().is.isChrome(),
		 duration: 600,
		 inclination: 0,
		 elevation: 50,
		 bookSingle: false,
		 toolbarHeight: 100,
		 zoomData: {
		 pageZoomDefault: 2,
		 pageZoomMin: 1,
		 pageZoomMax: 5
		 }
		 },*/
		// go to page function
		gotoPage: function(param) {
			// 인터페이스
		},

		firstPage: function() {
			this.gotoPage(1);
		},

		prevPage: function() {
			// 인터페이스
		},

		nextPage: function() {
			// 인터페이스
		},

		lastPage: function() {
			this.gotoPage(this.collection.models.length);
		},

		zoom: function() {
			// 인터페이스
		},

		getView: function() {
			// 인터페이스
		},

		isZoomMode: function() {
			return this.zooming;
		},

		// 컨텐츠 추가
		addContent: function(page) {
			var self = this,
				$el = this.$el,
				$bookComponent = this.$bookComponent,
				totalPages = $bookComponent.turn('pages');

			var $pageContainer = $el.find('.page-container[data-id=' + page + ']');
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

		// 그려진 실제 page사이즈 대비 원본 사이즈 비율
		checkPageRadio: function() {
			var self = this,
				$el = this.$el,
				$bookComponent = this.$bookComponent;

			self.pageRadio = parseInt($bookComponent.css('height'), 10) / self.bookConfig.bookHeight;
			console.log('pageRadio ::', self.pageRadio);
			$bookComponent.find('.content-container').css('zoom', self.pageRadio);
		},

		getClickMousePoint: function(e) {
			var self = this,
				clickMouseX,
				clickMouseY,
				target,
				targetX,
				targetY,
				bookMode;

			if(e) {
				clickMouseX = e.clientX;
				clickMouseY = e.clientY;
				target = $(e.currentTarget);
				targetX = Math.round(target.offset().left);
				targetY = Math.round(target.offset().top);
				bookMode = (self.bookConfig.bookSingle) ? 'single' : 'double';
			}

			clickMouseX = clickMouseX - targetX;
			clickMouseY = clickMouseY - targetY;

			//가운데 기준 좌표값으로 치환
			if(bookMode === "single"){
				clickMouseX = clickMouseX - (target.width() / 2);
			}else{
				if(parseInt(target.attr('page'), 10) % 2 === 0){
					clickMouseX = clickMouseX - (target.width());
				}else{
					clickMouseX = clickMouseX;
				}
			}
			console.log('mouse : ', clickMouseX, clickMouseY);
			return { mouseX: clickMouseX, mouseY: clickMouseY };
		},

		events: {
			/* page move event */
			'GO_PRE_PAGE': 'prevPage',
			'GO_NEXT_PAGE': 'nextPage',
			'GO_FIRST_PAGE': 'firstPage',
			'GO_LAST_PAGE': 'lastPage'
		},

        initialize: function() {
            // TODO : Book 화면 생성, 각각의 page별 view 생성해서 연결한ㄴ 고리 역활, Book관련 api제공

			var self = this,
				$el = this.$el;

			// book config 설정 변경
			self.bookConfig = config().config.bookConfig
			self.bookConfig.acceleration = !theHelper().is.isChrome()

			// 페이지 정보 저장소 저장
			self.pagesCollection = self.collection;

			// bookSingle mode check
			if(MOBILE) { self.bookConfig.bookSingle = !theHelper().is.isWide(); }

			// TODO : 페이지 로드 기능 , 페이지 이동 기능, 북 영역 이벤트 리스너
			console.log($el);
			$el.html(this.template());
			// render
			this.render();
        },

		render: function() {
			// 화면 구성
			var self = this,
				$el = this.$el;
		}
    });

});
