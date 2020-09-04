'use strict';
var http = require('http');
var fs = require('fs');
var AdmZip = require('adm-zip');
var bigXml = require('big-xml');
var FidePlayerService = /** @class */ (function () {
    function FidePlayerService(properties) {
        this.properties = properties;
        this.fide = properties.db.fide;
    }
    /**
     * This method does a http GET request to the fide download page for a zip XML data file.
     * @return { promise }
     * @param { string } fileName
     */
    FidePlayerService.prototype.download = function (fileName) {
        var _this = this;
        console.log('Initialised Download', fileName);
        return new Promise(function (resolve, reject) {
            try {
                var path = _this.fide.folder + "/" + fileName;
                var file_1 = fs.createWriteStream(_this.fide.folder + "/" + fileName);
                console.log('Executing HTTP GET', _this.fide.url);
                http.get(_this.fide.url, function (response) {
                    response.pipe(file_1);
                    file_1.on('finish', function () {
                        file_1.close();
                        resolve(file_1);
                    });
                }).on('error', function (error) {
                    fs.unlink(_this.fide.folder);
                    reject(new Error(error));
                });
            }
            catch (error) {
                reject(new Error(error));
            }
        });
    };
    /**
     * This method takes the unzipped xml file and reads it into JSON where all other processes
     * outside of this service can just that data source.
     * @return { promise }
     * @param { string } file
     **/
    FidePlayerService.prototype.createJson = function (file) {
        var _this = this;
        var reader = bigXml.createReader(this.properties.db.fide.folder + this.properties.db.fide.xmlFile, /^(player)$/, {
            gzip: false
        });
        var counter = 0;
        var players = [];
        return new Promise(function (resolve, reject) {
            try {
                reader.on('record', function (record) {
                    var p = record.children;
                    var player = {};
                    try {
                        var rating = p[8];
                        player = {
                            id: parseInt(p[0].text, 10) || null,
                            name: p[1].text || null,
                            title: p[4].text || null,
                            sex: p[3].text || null,
                            country: p[2].text || null
                        };
                        if (typeof rating !== 'undefined' || typeof rating.text !== 'undefined') {
                            player.rating = parseInt(p[8].text, 10) || null;
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    try {
                        players.push(player);
                        counter++;
                    }
                    catch (error) {
                        reject(new Error(error));
                    }
                });
                var path_1 = "" + _this.fide.folder + file;
                reader.on('end', function () {
                    fs.writeFile(path_1, JSON.stringify(players), 'UTF8', function (err) {
                        if (err)
                            console.error(err);
                    });
                    resolve(file);
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    /**
     * This method takes a .zip file and unzips it to the same folder.
     * @return { promise }
     * @param { string } file
     */
    FidePlayerService.prototype.extract = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (file.indexOf('.zip') === -1) {
                reject(new Error('File must be stored as a .zip'));
            }
            var path = "" + _this.fide.folder + file;
            var zip = new AdmZip(path);
            var zipEntries = zip.getEntries();
            zipEntries.forEach(function (zipEntry) {
                if (zipEntry.entryName === _this.fide.xmlFile) {
                    try {
                        zip.extractEntryTo(_this.fide.xmlFile, _this.fide.folder, false, true);
                        resolve('Extract complete.');
                    }
                    catch (error) {
                        reject(new Error(error));
                    }
                }
                else {
                    reject(new Error('Unable to match file'));
                }
            });
        });
    };
    return FidePlayerService;
}());
// TESTING:
// const service = new FidePlayerService(require('./config.json'));
// const download = service.download('data.zip');
// service.extract('data.zip');
// service.createJson('data.json');
module.exports = FidePlayerService;
