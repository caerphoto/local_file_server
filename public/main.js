define([
    'model_dirs',
    'view_path',
    'view_dirs',
    'view_files'
], function (DirsModel, PathView, DirsView, FilesView) {

    function init(dirData) {
        var model = new DirsModel({
            directories: dirData.directories,
            files: dirData.files,
            pathParts: dirData.pathParts,
            relativePath: dirData.relativePath
        });

        new PathView({
            model: model
        });

        new FilesView({
            model: model
        });

        new DirsView({
            model: model
        });

        window.onpopstate = function (evt) {
            if (evt.state) {
                model.set(evt.state);
            }
        };
    }

    return init;
});
