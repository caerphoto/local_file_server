define([
    'underscore',
    'jquery',
    'view_base'
], function (_, $, BaseView) {
    var DirsView = BaseView.extend({
        el: '#directories tbody',
        template: _.template($('#directories-template').html()),

        events: {
            'click a': 'loadDirectory'
        },

        listenAttr: 'directories'
    });

    return DirsView;
});

