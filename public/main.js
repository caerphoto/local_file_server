define([
    'model_dirs',
    'view_path',
    'view_dirs',
    'view_files',
    'quickslide-min'
], function (DirsModel, PathView, DirsView, FilesView, QS) {

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

        QS({
            auto_detect: true,
            use_dimmer: true,
            no_wait: true
        });

        window.onpopstate = function (evt) {
            if (evt.state) {
                model.set(evt.state);
            }
        };
    }

    return init;
});
