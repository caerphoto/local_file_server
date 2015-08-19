define([
    'underscore',
    'jquery',
    'backbone',
    'model_dirs'
], function (_, $, Backbone, DirsModel) {
    var DirsView = Backbone.View.extend({
        el: 'table.directories tbody',
        template: _.template($('#dirs-template').html()),
        model: null,

        events: {
            'click a': 'loadDirectory'
        },

        initialize: function (options) {
            var state;

            this.model = new DirsModel({ dirs: options.dirs });
            this.filesView = options.filesView;
            this.relativePath = options.relativePath;

            this.$path = $('#path-parts');
            this.pathTemplate = _.template($('#path-template').html());

            this.render();

            if (history.state) {
                state = history.state;
                state.directories = options.dirs;
                state.relativePath = options.relativePath;
                history.replaceState(state, "", window.location);
            } else {
                history.replaceState({
                    directories: options.dirs
                }, "", window.location);
            }
            this.listenTo(this.model, 'change:dirs', this.render);
        },

        render: function () {
            this.el.innerHTML = this.template({
                relativePath: this.relativePath,
                dirs: this.model.get('dirs')
            });

            return this;
        },

        loadDirectory: function (evt) {
            var path = evt.target.getAttribute('href');
            evt.preventDefault();

            $.get(path + '?json').done(function (dirData) {
                history.pushState(dirData, "", evt.target.href);

                this.$path.html(this.pathTemplate({ parts: dirData.pathParts }));

                this.relativePath = path;
                this.model.set('dirs', dirData.directories);

                this.filesView.relativePath = path;
                this.filesView.model.set('files', dirData.files);
            }.bind(this)).fail(function (err) {
                console.log(err);
            });
        }
    });

    return DirsView;
});

