/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates',
	'scripts/views/BookComponent'
], function(Backbone, JST, BookComponentView) {
    'use strict';

	// BookComponent extend
    var BookComponentPageView = BookComponentView.extend({
	    events: {

	    },
        initialize: function() {
            // TODO : Book 화면 생성, 각각의 page별 view 생성해서 연결한ㄴ 고리 역활, Book관련 api제공

	        var self = this,
		        $el = this.$el;

			// TODO : Page 북 모션 이벤트 처리, 페이지 렌더링 처리
        }
    });

	return BookComponentPageView;

});
