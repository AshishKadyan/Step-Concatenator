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
var fs = require('fs-extra');
var fs1 = require('fs');
var config = require('../config');
var rimraf = require('rimraf');
var p1 = [];
var structure = /** @class */ (function () {
    function structure() {
        this.source1 = config.paths.path1;
        this.source2 = config.paths.path2;
        this.destination = config.paths.dest;
        this.map_files_copied = {};
        this.map_updated_dest = {};
        this.counter1 = 0;
    }
    structure.prototype.driver = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var self = _this;
            _this.clearDest(config.paths.dest).then(function a() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self.copyMap(self.source1, self.destination)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, self.copyMap(self.source2, self.destination)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }).then(function () {
                resolve();
            });
        });
    };
    structure.prototype.clearDest = function (dest) {
        return new Promise(function (resolve, reject) {
            rimraf(dest, function () {
                console.log('cleaned up ' + dest + ' directory');
                resolve();
            });
        });
    };
    structure.prototype.copyMap = function (source, dest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs1.readdir(source, function (err, files) {
                var dest_file = "";
                var updated_destination = "";
                var updated_source = "";
                files.forEach(function (file) {
                    var file_lowercase = file.toLowerCase();
                    if (file_lowercase.indexOf("asset") > -1) {
                        updated_source = source + ("/") + file;
                        //  console.log(updated_source)
                        _this.copyMap(updated_source, dest);
                    }
                    else {
                        if (file != "task.xml" && file != "practice.json") {
                            updated_source = source + "/" + file;
                            if (_this.map_files_copied[file] == undefined) {
                                _this.map_files_copied[file] = 0;
                            }
                            else {
                                _this.map_files_copied[file]++;
                            }
                            if (_this.map_files_copied[file] == 0) {
                                updated_destination = dest + "/" + file;
                            }
                            else {
                                if (file.indexOf(".") > -1) {
                                    updated_destination = dest + "/Step2/" + file;
                                }
                                else {
                                    updated_destination = dest + "/Step2/" + file;
                                }
                            }
                            _this.map_files_copied[updated_source] = updated_destination;
                            console.log(_this.map_files_copied);
                            _this.copy(updated_source, updated_destination);
                        }
                    }
                });
            });
        });
    };
    structure.prototype.copy = function (source, destination) {
        return new Promise(function (resolve, reject) {
            fs.copy(source, destination, function (err) {
                if (err) {
                    console.log('An error occured while copying the folder.');
                    return console.error(err);
                }
                console.log('Copy completed!');
                resolve();
            });
        });
    };
    return structure;
}());
exports.structure = structure;
;
// let structure1=new structure();
// structure1.driver();
