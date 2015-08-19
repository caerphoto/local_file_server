define([
    'backbone'
], function (Backbone) {
    var FilesModel = Backbone.Model.extend({
        defaults: {
            files: []
        }
    });

    return FilesModel;
});
