//jshint node:true
/*global JSON*/
var fstatic = require('node-static');
var rootDir = '/';
var fileServer = new fstatic.Server(rootDir, { cache: 0 });
var fs = require('fs');
var url = require('url');
var path = require('path');
var jade = require('jade');
var render = jade.compile(
    fs.readFileSync(path.join(__dirname, 'dir.jade'),
    { encoding: 'UTF-8'})
);

function logx(number, base) {
    'use strict';
    // Returns logarithm of number with given base.
    return Math.log(number) / Math.log(base);
}

function formatSize(size) {
    'use strict';
    var suffixes = [
        ' B',
        ' KB',
        ' MB',
        ' GB',
        ' TB'
    ];
    var magnitude = Math.floor(logx(size, 1024));

    return (size / Math.pow(1024, magnitude)).toPrecision(3) +
        suffixes[magnitude];
}

function getDirectoryContents(dir, callback) {
    'use strict';
    fs.readdir(dir, function (err, filenames) {
        var dirs = [];
        var files = [];

        filenames.forEach(function (filename) {
            var ext;
            var stat = fs.lstatSync(path.join(dir, filename));
            if (stat.isDirectory()) {
                dirs.push(filename);
            } else {
                ext = filename.match(/\..+$/);
                files.push({
                    'name': filename,
                    extension: ext ? ext[0] : '',
                    formattedSize: formatSize(stat.size),
                    size: stat.size,
                    lastModified: stat.mtime
                });
            }
        });

        dirs.sort(function (a, b) {
            return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
        });

        files.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();

            return x < y ? -1 : 1;
        });

        callback({ directories: dirs, files: files });
    });
}

require('http').createServer(function (req, res) {
    'use strict';
    req.addListener('end', function () {
        var urlPath = url.parse(req.url).path;
        var fullPath = path.join(rootDir, urlPath);
        if (/\?/.test(fullPath)) {
            fullPath = fullPath.split('?')[0];
        }

        fullPath = decodeURIComponent(fullPath).replace(/\s/g, '\ ');

        fs.stat(fullPath, function (err, stats) {
            if (err) {
                if (err && err.code === 'ENOENT') {
                    console.log('Not found:', fullPath);
                    res.writeHead(404);
                } else {
                    console.log(err);
                    res.writeHead(500);
                }
                return res.end();
            }

            if (stats.isDirectory()) {
                console.log('Serving directory:', fullPath);
                getDirectoryContents(fullPath, function (contents) {
                    var relativePath = urlPath.replace(/(.+)\/$/, '$1');
                    var pathParts = relativePath.slice(1).split('/');
                    var responseData;
                    var html;

                    pathParts = pathParts.map(function (part, index) {
                        return {
                            url: '/' + pathParts.slice(0, index + 1).join('/'),
                            part: part.split('?')[0]
                        };
                    });

                    if (relativePath === '/') {
                        relativePath = '';
                    }

                    relativePath = relativePath.split('?')[0];

                    responseData = {
                        assetPath: path.join(__dirname, '/public/'),
                        relativePath: relativePath,
                        pathParts: pathParts,
                        directories: contents.directories,
                        files: contents.files
                    };

                    if (url.parse(req.url).query === 'json') {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(responseData));
                        return;
                    }

                    html = render(responseData);
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    res.end(html);
                });

            } else {
                console.log([new Date(), fullPath].join('\t'));
                fileServer.serve(req, res, function (err) {
                    if (err) {
                        console.log('Error serving file for:', req.url);
                        res.writeHead(err.status, err.headers);
                    }
                    res.end();
                });

            }
        });
    }).resume();
}).listen(8000, '0.0.0.0');

console.log('Listening on 8000...');
