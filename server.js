//jshint node:true
var static = require("node-static");
var rootDir = "/";
var fileServer = new static.Server(rootDir, { cache: 0 });
var fs = require("fs");
var url = require("url");
var path = require("path");
var jade = require("jade");
var render = jade.compile(fs.readFileSync(path.join(__dirname, "dir.jade"),
    { encoding: "UTF-8"}));

function formatSize(size) {
    var suffixes = [
        " B",
        " KB",
        " MB",
        " GB"
    ];
    var i = 0;

    while (size > 1024) {
        size = size / 1024;
        i += 1;
    }

    return size.toPrecision(3) + suffixes[i];
}

function getDirectoryContents(dir, callback) {
    fs.readdir(dir, function (err, filenames) {
        var dirs = [];
        var files = [];

        filenames.forEach(function (filename) {
            var ext;
            var stat = fs.statSync(path.join(dir, filename));
            if (stat.isDirectory()) {
                dirs.push(filename);
            } else {
                ext = filename.match(/\..+$/);
                files.push({
                    "name": filename,
                    extension: ext ? ext[0] : "",
                    size: formatSize(stat.size),
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

require("http").createServer(function (req, res) {
    req.addListener("end", function () {
        var urlPath = url.parse(req.url).path;
        var fullPath = path.join(rootDir, urlPath);
        if (/\?/.test(fullPath)) {
            fullPath = fullPath.split("?")[0];
        }

        fs.stat(fullPath, function (err, stats) {
            if (err) {
                if (err.errno === 34) {
                    console.log("Not found:", fullPath);
                    res.writeHead(404);
                } else {
                    console.log(err);
                    res.writeHead(500);
                }
                return res.end();
            }

            if (stats.isDirectory()) {
                console.log("Serving directory:", fullPath);
                getDirectoryContents(fullPath, function (contents) {
                    var relativePath = urlPath.replace(/(.+)\/$/, "$1");
                    var pathParts = relativePath.slice(1).split("/");
                    var html;

                    pathParts = pathParts.map(function (part, index) {
                        return {
                            url: "/" + pathParts.slice(0, index + 1).join("/"),
                            part: part
                        };
                    });

                    if (relativePath === "/") {
                        relativePath = "";
                    }

                    html = render({
                        cssPath: path.join(__dirname, "style.css"),
                        relativePath: relativePath,
                        pathParts: pathParts,
                        directories: contents.directories,
                        files: contents.files
                    });
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                    res.end(html);
                });

            } else {
                console.log([new Date(), fullPath].join("\t"));
                fileServer.serve(req, res, function (err) {
                    if (err) {
                        console.log("Error serving file for:", req.url);
                        res.writeHead(err.status, err.headers);
                    }
                    res.end();
                });

            }
        });
    }).resume();
}).listen(80, "127.0.0.1");

console.log("Listening on 80...");
