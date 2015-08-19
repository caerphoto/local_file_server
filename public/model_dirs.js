define([
    'backbone'
], function (Backbone) {
    var DirsModel = Backbone.Model.extend({
        defaults: {
            dirs: []
        }
    });

    return DirsModel;
});

