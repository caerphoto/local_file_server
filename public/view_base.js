define([
    'underscore',
    'jquery',
    'backbone',
], function (_, $, Backbone) {
    var BaseView = Backbone.View.extend({
        listenAttr: '',

        initialize: function () {
            this.render();

            if (!history.state) {
                history.replaceState(this.model.attributes, "", window.location);
            }
            this.listenTo(this.model, 'change:' + this.listenAttr, this.render);
        },

        render: function () {
            this.el.innerHTML = this.template(this.model.attributes);
            document.title = this.model.get('relativePath');
            return this;
        },

        loadDirectory: function (evt) {
            var path = evt.target.getAttribute('href');
            var url = evt.target.href;
            evt.preventDefault();
            this.model.loadDirectory(path, url);
        }
    });

    return BaseView;
});


