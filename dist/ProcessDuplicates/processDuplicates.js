"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compare = require('./compare');
var fsMover = require('fs-extra');
var createCSVFile = require('csv-file-creator');
var fs = require('fs');
var filehound = require('filehound');
var config = require('../../config');
var path = require('path');
var rimraf = require('rimraf');
var processDuplicates = /** @class */ (function () {
    function processDuplicates() {
        this.duplicateMap = {};
        this.path1 = config.paths.dest;
        this.path2 = config.paths.path2;
        this.counter = 1;
        this.duplicatesArray = [];
        this.checkMap = {};
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
    processDuplicates.prototype.comparePathsArray = function (array1) {
        return __awaiter(this, void 0, void 0, function () {
            var self, counter;
            var _this = this;
            return __generator(this, function (_a) {
                console.log("Resources found : ");
                console.log(array1);
                self = this;
                counter = 0;
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var outer_index, element, inner_index, element2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    outer_index = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(outer_index < array1.length)) return [3 /*break*/, 6];
                                    element = array1[outer_index];
                                    inner_index = outer_index + 1;
                                    _a.label = 2;
                                case 2:
                                    if (!(inner_index < array1.length)) return [3 /*break*/, 5];
                                    element2 = array1[inner_index];
                                    if (!!this.checkMap[element2]) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.compare2Paths(element, element2)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    inner_index++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    outer_index++;
                                    return [3 /*break*/, 1];
                                case 6:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    processDuplicates.prototype.startProcessing = function () {
        return __awaiter(this, void 0, void 0, function () {
            function purifier(array) {
                var purifiedArray = array.filter(function (path) {
                    var paths_array = path.split("\\");
                    return !(paths_array[paths_array.length - 1] == "task.xml" || paths_array[paths_array.length - 1] == "practice.json");
                });
                return purifiedArray;
            }
            var self, array1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, this.pathFinder(this.path1)];
                    case 1:
                        array1 = _a.sent();
                        return [4 /*yield*/, this.comparePathsArray(array1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.prepareResult()
                            // this.moveResource("duplicate")
                        ];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    processDuplicates.prototype.prepareResult = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var counter = 0;
            for (var key in _this.duplicateMap) {
                _this.duplicatesArray.push([]);
                _this.duplicatesArray[counter].push(key);
                _this.duplicateMap[key].forEach(function (element) {
                    _this.duplicatesArray[counter].push(element);
                });
                counter++;
            }
            //console.log(this.map_result)
            createCSVFile('result.csv', _this.duplicatesArray);
            resolve(_this.duplicateMap);
        });
    };
    processDuplicates.prototype.compare2Paths = function (path1, path2) {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            var _this = this;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ext_check, size_check, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    ext_check = function (path1, path2) {
                                        return (path.extname(path1) == path.extname(path2));
                                    };
                                    size_check = function (path1, path2) {
                                        var stats = fs.statSync(path1);
                                        var fileSizeInBytes = stats.size;
                                        var stats1 = fs.statSync(path2);
                                        var fileSizeInBytes1 = stats1.size;
                                        return (fileSizeInBytes == fileSizeInBytes1);
                                    };
                                    if (!(ext_check(path1, path2) && size_check(path1, path2))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, compare.compareExtensionType(path1, path2, path.extname(path1))];
                                case 1:
                                    res = _a.sent();
                                    if (res) {
                                        self.checkMap[path2] = true;
                                        if (this.duplicateMap[path1] == undefined) {
                                            this.duplicateMap[path1] = [];
                                        }
                                        this.duplicateMap[path1].push(path2);
                                        this.counter++;
                                        resolve();
                                    }
                                    _a.label = 2;
                                case 2:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
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
            for (var key in this.duplicateMap) {
                resourseToMove(this.duplicateMap[key], dest2);
            }
        }
    };
    processDuplicates.prototype.driver = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.clearDest(config.paths.dest + "/trash")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, self.startProcessing()];
                    case 2:
                        _a.sent();
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return processDuplicates;
}());
exports.default = processDuplicates;
