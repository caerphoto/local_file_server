define([
    'underscore',
    'jquery',
    'backbone',
    'model_files'
], function (_, $, Backbone, FilesModel) {
    var FilesView = Backbone.View.extend({
        el: 'table.files tbody',
        template: _.template($('#files-template').html()),
        model: null,

        initialize: function (options) {
            var state;

            this.model = new FilesModel({ files: options.files });
            this.relativePath = options.relativePath;
            this.render();

            if (history.state) {
                state = history.state;
                state.files = options.files;
                state.relativePath = options.relativePath;
                history.replaceState(state, "", window.location);
            } else {
                history.replaceState({
                    files: options.files
                }, "", window.location);
            }
            this.listenTo(this.model, 'change:files', this.render);
        },
        render: function () {
            this.el.innerHTML = this.template({
                relativePath: this.relativePath,
                files: this.model.get('files')
            });
            return this;
        }
    });

    return FilesView;
});
