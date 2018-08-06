"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compare = require('./compare');
var fsMover = require('fs-extra');
var createCSVFile = require('csv-file-creator');
var fs = require('fs');
var filehound = require('filehound');
var config = require('../config');
var path = require('path');
var rimraf = require('rimraf');
var processDuplicates = /** @class */ (function () {
    function processDuplicates() {
        this.map_result = {};
        this.path1 = config.paths.dest;
        this.path2 = config.paths.path2;
        this.counter = 1;
        this.result = [];
        this.check_map = {};
    }
    processDuplicates.prototype.pathFinder = function (path) {
        return new Promise(function (resolve, reject) {
            var files = filehound.create()
                .paths(path)
                .find();
            //  console.log(files)
            resolve(files);
        });
    };
    processDuplicates.prototype.clearDest = function (dest) {
        return new Promise(function (resolve, reject) {
            rimraf(dest, function () {
                console.log('cleaned up ' + dest + ' directory');
                resolve();
            });
        });
    };
    processDuplicates.prototype.constructTask = function () {
        var _this = this;
        var self = this;
        function purifier(array) {
            var purifiedArray = array.filter(function (path) {
                var paths_array = path.split("\\");
                return !(paths_array[paths_array.length - 1] == "task.xml" || paths_array[paths_array.length - 1] == "practice.json");
            });
            return purifiedArray;
        }
        Promise.all([this.pathFinder(this.path1), this.pathFinder(this.path2)]).then(function (values) {
            var array1 = purifier(values[0]);
            var array2 = purifier(values[1]);
            array1.forEach(function (element, outer_index) {
                array1.forEach(function (element2, inner_index) {
                    if (inner_index > outer_index) {
                        if (!_this.check_map[element2])
                            _this.comparer(element, element2); //compare files in folder asset2
                    }
                });
            });
        }).then(function () {
            self.prepareResult();
        }).then(function () {
            self.moveResource("duplicate");
        });
    };
    processDuplicates.prototype.prepareResult = function () {
        var _this = this;
        console.log("here");
        var counter = 0;
        for (var key in this.map_result) {
            this.result.push([]);
            this.result[counter].push(key);
            this.map_result[key].forEach(function (element) {
                _this.result[counter].push(element);
            });
            counter++;
        }
        console.log(this.map_result);
        createCSVFile('result.csv', this.result);
    };
    processDuplicates.prototype.comparer = function (path1, path2) {
        var ext_check = function (path1, path2) {
            return (path.extname(path1) == path.extname(path2));
        };
        var size_check = function (path1, path2) {
            var stats = fs.statSync(path1);
            var fileSizeInBytes = stats.size;
            var stats1 = fs.statSync(path2);
            var fileSizeInBytes1 = stats1.size;
            return (fileSizeInBytes == fileSizeInBytes1);
        };
        if (ext_check(path1, path2) && compare.compareExtensionType(path1, path2, path.extname(path1))) {
            this.check_map[path2] = true;
            if (this.map_result[path1] == undefined) {
                this.map_result[path1] = [];
            }
            this.map_result[path1].push(path2);
            this.counter++;
        }
    };
    processDuplicates.prototype.moveFile = function (src, dest) {
        var files_to_copy_array = src.split("\\");
        var filename = files_to_copy_array[files_to_copy_array.length - 1];
        fsMover.move(src, dest + "/" + filename);
    };
    processDuplicates.prototype.moveResource = function (type) {
        var self = this;
        function resourseToMove(resourseArray, dest) {
            resourseArray.forEach(function (element) {
                self.moveFile(element, dest);
            });
        }
        if (type == "duplicate") {
            var dest2 = config.paths.dest + "/trash";
            for (var key in this.map_result) {
                resourseToMove(this.map_result[key], dest2);
            }
        }
    };
    processDuplicates.prototype.driver = function () {
        var self = this;
        self.clearDest(config.paths.dest + "/trash").then(function () {
            self.constructTask();
        });
    };
    return processDuplicates;
}());
exports.processDuplicates = processDuplicates;
var ProcessDuplicates = new processDuplicates();
ProcessDuplicates.driver();
