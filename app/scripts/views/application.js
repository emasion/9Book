/**
 * Created by 강동완 on 2014-06-07.
 */
define([
    'scripts/models/Config',
	'helper',
    'scripts/views/MainBook',
    'scripts/views/MainCapBar',
    'scripts/views/MainControlBar'
], function(config, theHelper, MainBookView, MainCapBarView, MainControlBarView) {
    'use strict';

	var ApplicationView = Backbone.View.extend({
		configUrl: 'public/json/config.json',
		config: null,
		initialize: function () {
			var self = this;

			var yepnopeLoadComplete = function () {
				self.loadConfigStart();
			};

			yepnope({
				test: Modernizr.csstransforms,
				//yep: ['../bower_components/turn.js/turn.min.js'],
				nope: ['../bower_components/turn.js/turn.html4.min.js'],
				//both: ['../../lib/zoom.js', 'js/magazine.js', 'css/magazine.css'],
				complete: yepnopeLoadComplete
			});

			if (MOBILE) {
				self.touchScrollingPreventDefault();
			}
		},

		loadConfigStart: function () {
			var self = this;
			// TODO: Config 설정 부분
			// get Config - 최초
			config().on('loadComplete', _.bind(self.loadConfigComplete, self));
			config().load(this.configUrl);

		},

		loadConfigComplete: function (e) {
			var self = this;
			if (config().config) {
				theHelper().debugger.debuggerModeOn();
				self.config = config().config;
				self.render();
			}
		},

		touchScrollingPreventDefault: function () {
			//터치 스크롤링 금지
			try {
				document.body.addEventListener('touchmove', function (event) {
					event.preventDefault();
				}, false);
			} catch (e) {

			}
		},

		render: function () {
			// Fill the html with the template and the collection
			//$(this.el).html(this.template({ tweets: this.collection.toJSON() }));
			console.log("/////////////////////// render /////////////////////////");

			new MainBookView({
				el: $('#mainBook')
			});

			new MainCapBarView({
				el: $('#mainCapBar')
			});

			new MainControlBarView({
				el: $('#mainControlBar')
			});
		}
	});

    return ApplicationView;
});
