/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
    'backbone'
], function(Backbone) {
    'use strict';

    var ContentModel = Backbone.Model.extend({
	    idAttribute: '_id',
        defaults: {
	        "_id": "1",
	        "page": "1",
	        "itmes": []
        },
        initialize: function() {
        }
    });

    return ContentModel;
});
