define([
    'view_dirs',
    'view_files'
], function (DirsView, FilesView) {

    function init(dirData, fileData, relativePath) {
        var filesView = new FilesView({
            files: fileData,
            relativePath: relativePath
        });

        var dirsView = new DirsView({
            dirs: dirData,
            relativePath: relativePath,
            filesView: filesView
        });

        window.onpopstate = function (evt) {
            if (evt.state) {
                dirsView.model.set('dirs', evt.state.directories);
                filesView.model.set('files', evt.state.files);
                dirsView.relativePath = filesView.relativePath =
                    evt.state.relativePath;
            }
        };
    }

    return init;
});
