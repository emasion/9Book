/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/views/MainBook'
], function(Backbone, JST, mainBookView) {
    'use strict';

    var MainControlBarView = Backbone.View.extend({
        template: JST['app/scripts/templates/MainControlBar.ejs'],
	    onClickFirstPage: function() {
		    var self = this;
		    mainBookView().goFirstPage();
	    },
	    onClickPrevPage: function() {
		    var self = this;
		    mainBookView().goPrevPage();
	    },
	    onClickNextPage: function() {
		    var self = this;
		    mainBookView().goNextPage();
	    },
	    onClickLastPage: function() {
		    var self = this;
		    mainBookView().goLastPage();
	    },
	    events: {
		    "click [data-id=btnFirst]":  "onClickFirstPage",
		    "click [data-id=btnPrev]":   "onClickPrevPage",
		    "click [data-id=btnNext]":  "onClickNextPage",
		    "click [data-id=btnLast]":  "onClickLastPage"
	    },
        initialize: function() {
            // TODO : 메뉴 생성 및 기능 정의 api
	        var self = this,
		        $el = this.$el;

	        $el.html(this.template());
        }
    });

    return MainControlBarView;
});
