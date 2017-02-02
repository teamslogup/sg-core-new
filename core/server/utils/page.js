var fs = require('fs');
var path = require('path');

module.exports = {
    getPages: function () {
        var pagesPath = path.join(__dirname, '../../../app/routes');
        var pages = [];

        if (fs.existsSync(pagesPath)) {
            var files = fs.readdirSync(pagesPath);

            files.map(function (file) {
                return path.join(pagesPath, file);
            }).filter(function (file) {
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                var splited = file.split('/');
                var fileName = splited[splited.length - 1].split('.')[0];
                if (fileName != 'index') {
                    pages.push(fileName);
                }
            });
        }

        return pages;
    }
};