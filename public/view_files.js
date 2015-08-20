define([
    'underscore',
    'jquery',
    'view_base'
], function (_, $, BaseView) {
    var FilesView = BaseView.extend({
        el: 'table.files tbody',
        template: _.template($('#files-template').html()),

        listenAttr: 'files',
    });

    return FilesView;
});
