/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone'
], function(Backbone) {
    'use strict';

    var PageModel = Backbone.Model.extend({
	    url:'',
	    idAttribute: '_id',
        defaults: {
	        _id: '',
            source: '',
	        thumbnail: '',
	        caption: ''
        },
        initialize: function() {
            // TODO : json 데이터 받아온다?
        }
    });

    return PageModel;
});
