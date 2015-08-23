define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    var DirsModel = Backbone.Model.extend({
        defaults: {
            directories: [],
            files: [],
            pathParts: [],
            relativePath: '',
            sortDirectoriesAscending: true,
            fileSortColumn: 'name',
            fileSortAscending: true
        },

        toggleDirectorySortDirection: function () {
            this.set('sortDirsAscending', !this.get('sortDirsAscending'));
            // Need to call .reverse() on a copy because reverse is in-place.
            this.set('directories', this.get('directories').slice().reverse);
        },

        sortFilesBy: function (column, ascending) {
            var files = this.get('files').slice();

            if (column === 'size') {
                files.sort(function (a, b) {
                    return a.size - b.size;
                });
            } else {
                files.sort(function (a, b) {
                    var x = a[column].toLowerCase();
                    var y = b[column].toLowerCase();
                    x = x.slice(x.indexOf('.') + 1);
                    y = y.slice(y.indexOf('.') + 1);
                    return x < y ? -1 : 1;
                });
            }

            if (ascending) {
                files.reverse();
            }

            this.set('files', files);
            this.set('fileSortAscending', ascending);
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

