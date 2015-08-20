define([
    'underscore',
    'jquery',
    'view_base'
], function (_, $, BaseView) {
    var FilesView = BaseView.extend({
        el: '#files',
        template: _.template($('#files-template').html()),

        events: {
            'click th': 'sortFiles'
        },

        listenAttr: 'files',

        sortFiles: function (evt) {
            var column = evt.target.getAttribute('data-column');
            var sortDirection = !this.model.get('fileSortAscending');

            console.log('sort by', column, sortDirection);
            this.model.sortFilesBy(column, sortDirection);
        }
    });

    return FilesView;
});
