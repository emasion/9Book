/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/views/ThumbnailItem'
], function(Backbone, JST, ThumbnailItemView) {
    'use strict';

	return Backbone.View.extend({
		//template: JST['app/scripts/templates/ThumbnailSlider.ejs'],
		el: $('#thumbnailSlider'),
		thumbnailSlider: null,
		events: function() {
			return MOBILE ?
			{
				'touchstart .ms-slide': 'onThumbnailItemClick'
			} : {
				'click .ms-slide': 'onThumbnailItemClick'
			};
		},

		change: function() {
			var self = this,
				$el = $(self.thumbnailSlider.$element);

			if($el.parent().css('display') === 'none' || $el.parent().css('top') !== 'auto' ) {
				self.show();
			}else {
				self.hide();
			}
		},

		show: function() {
			var self = this,
				$el = $(self.thumbnailSlider.$element);

			$el.parent().css('top', 'auto');
			$el.parent().show();
		},

		hide: function() {
			var self = this,
				$el = $(self.thumbnailSlider.$element);

			$el.parent().hide();
		},

		setPage: function(page) {
			var self = this;
			if(self.thumbnailSlider) {
				self.thumbnailSlider.api.gotoSlide(page - 1);
			}
		},

		onThumbnailItemClick: function(e) {
			var self = this,
				$el = this.$el,
				target = e.currentTarget,
				page = parseInt($(target).attr('data-id'), 10);

			self.thumbnailSlider.api.gotoSlide(page - 1);
			// page 이동
			//self.trigger('GO_TO_PAGE', {page: page});
		},

		onChangeThumbnail: function(e) {
			var self = this,
				page = e.target.currentSlide.index + 1;
			//console.log(page, e);
			self.trigger('GO_TO_PAGE', {page: page});
		},

		initialize: function(options) {
			// TODO : 메뉴 생성 및 기능 정의 api
			var self = this,
				$el = this.$el;

			//var itemHeight = 200;
			var itemWidth = 130;

			self.render();

			// 썸네일 생성
			//$('#thumbnailSlider').html($el.html())
			self.thumbnailSlider = new MasterSlider();
			self.thumbnailSlider.control('arrows');
			self.thumbnailSlider.setup('thumbnailSlider', {
				start: (options.start) ? options.start : 1,
				width: itemWidth,
				//height: itemHeight,
				autoHeight: true,
				grabCursor: false,
				space: 10,
				speed: 70,
				loop: false,
				wheel: true,
				view:'fadeWave',
				layout:'partialview'
			});
			self.thumbnailSlider.api.addEventListener(MSSliderEvent.CHANGE_START, _.bind(self.onChangeThumbnail, self));
			//setTimeout(function() {
			//	self.$el.parent().css('top', 'auto');
				//self.hide();
			//}, 100);

			// bind
			if (MOBILE) {
				self.thumbnailSlider.$element.find('.ms-slide').on('touchstart', _.bind(self.onThumbnailItemClick, self))
			} else {
				self.thumbnailSlider.$element.find('.ms-slide').on('click', _.bind(self.onThumbnailItemClick, self))
			}


		},

		render: function() {
			var self = this,
				$thumbnailSlider = $('#thumbnailSlider'),
				deferred = $.Deferred();

			//self.$el.empty();
			$thumbnailSlider.empty();
			self.collection.each(function (item) {
				var itemView = new ThumbnailItemView({ model: item });
				//self.$el.append(itemView.render().children());
				$thumbnailSlider.append(itemView.render().children());
			});

			return deferred;
		}
	});
});
