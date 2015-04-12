/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'bootstrap-window'
], function(Backbone, JST, BootstrapWindow) {
    'use strict';

	var WindowManagerSingle = Backbone.View.extend({
        template: JST['app/scripts/templates/WindowManager.ejs'],
		defaultOptions: {
			title: "윈도우",
			bodyContent: "<p>표시할 내용이 없습니다.</p>",
			footerContent: '<button type="button" class="btn btn-default" data-dismiss="window">닫기</button>'
		},

		open: function(options) {
			var self = this;
			var newOptions = _.defaults(options, self.defaultOptions);

			if(!windowManager) {
				self._initWidget();
			}

			self.resize(windowManager.createWindow(newOptions), options);
		},

		getWindow: function(id) {
			var self = this,
				windowManager = self.windowManager;

			if(!windowManager) {
				self._initWidget();
			}

			return windowManager.findWindowByID(id);
		},

		close: function(id) {
			var self = this,
				windowManager = self.windowManager,
				getWindow = self.getWindow(id);

			if(getWindow) {
				getWindow.getElement().find('.close').click();
			}
		},

		resize: function(win, options) {
			var self = this;

			if(!win) {
				return;
			}

			if(options.width) { win.resize({ width: options.width });}
			if(options.height) { win.resize({ height: options.height });}
			if(options.left) { win.resize({ left: options.left });}
			if(options.top) { win.resize({ top: options.top });}
			win.centerWindow();
		},

		_initWidget: function() {
			var self = this;
			var windowManager = new BootstrapWindow({
				container: "#windowPane",
				windowTemplate: $('#windowTemplate').html()
			});
			window.windowManager = windowManager;
			self.windowManager = windowManager;
		},

		events: function() {
			return MOBILE ?
			{
			} :
			{
			};
		},

        initialize: function() {
			var self = this,
				$el = this.$el;

			$el.html(this.template());
			self._initWidget();
		},

		render: function() {
		// 화면 구성
		}
    });

	// 싱글톤 처리
	var instance;
	return function() {
		if(!instance) {
			instance = new WindowManagerSingle({
				el: $('#windowManager')
			});
		}
		return instance;
	};

});
