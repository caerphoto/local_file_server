define([
    'underscore',
    'jquery',
    'view_base',
], function (_, $, BaseView) {
    var PathView = BaseView.extend({
        el: '#path',
        template: _.template($('#path-template').html()),

        events: {
            'click a': 'loadDirectory'
        },

        listenAttr: 'pathParts',
    });

    return PathView;
});

