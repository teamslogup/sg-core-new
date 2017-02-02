var fs = require('fs');
var path = require('path');

module.exports = {
    getPages: function () {
        var pagesPath = path.join(__dirname, '../../../app/client/pages');
        var pages = [];

        if (fs.existsSync(pagesPath)) {
            var files = fs.readdirSync(pagesPath);

            files.map(function (file) {
                return path.join(pagesPath, file);
            }).filter(function (file) {
                return fs.statSync(file).isDirectory();
            }).forEach(function (file) {
                var splited = file.split('/');
                var dirName = splited[splited.length - 1];
                if (dirName.indexOf('old-') == -1) {
                    pages.push(dirName);
                }
            });
        }

        return pages;
    }
};