define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    var DirsModel = Backbone.Model.extend({
        defaults: {
            directories: [],
            files: [],
            pathParts: [],
            relativePath: ''
        },

        loadDirectory: function (path, url) {
            $.get(path + '?json').done(function (dirData) {
                this.set('relativePath', path);
                this.set('directories', dirData.directories);
                this.set('files', dirData.files);
                this.set('pathParts', dirData.pathParts);

                history.pushState(this.attributes, "", url);
            }.bind(this)).fail(function (err) {
                console.log(err);
            });

        }
    });

    return DirsModel;
});

