/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone',
    'templates'
], function(Backbone, JST) {
    'use strict';

    return Backbone.View.extend({
        template: JST['app/scripts/templates/Page.ejs'],
		events: {
			/* page mouse event, contents event? */

		},

		initialize: function() {
			// TODO : Page 화면 구성
			var self = this,
			$el = this.$el;
			$el.html(this.template(this.model.attributes));
		},

		render: function() {
			// 화면 구성
		}
    });

});
