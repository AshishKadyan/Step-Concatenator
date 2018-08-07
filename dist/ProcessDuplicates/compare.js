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
var xml2js = require('xml2js');
var parser = xml2js.Parser();
var fs = require('fs');
var HtmlDiffer = require('html-differ').HtmlDiffer;
var logger = require('html-differ/lib/logger');
var equal = require("deep-equal");
var assert = require('assert');
var PNG = require('pngjs').PNG;
var pixelmatch = require('pixelmatch');
var imgDiff = require('img-diff-js').imgDiff;
function isOfSameSize(path1, path2) {
    return fs.statSync(path1).size === fs.statSync(path2).size;
}
function isEqualHtml(path1, path2) {
    console.log("comparing files " + path1 + " & " + path2 + " on HTML-differ");
    var html1 = fs.readFileSync(path1, 'utf-8');
    var html2 = fs.readFileSync(path2, 'utf-8');
    var options = {
        ignoreAttributes: [],
        compareAttributesAsJSON: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false
    };
    var htmlDiffer = new HtmlDiffer(options);
    var diff = htmlDiffer.diffHtml(html1, html2), isEqual = htmlDiffer.isEqual(html1, html2), res = logger.getDiffText(diff, { charsAroundDiff: 40 });
    // logger.logDiffText(diff, { charsAroundDiff: 40 });
    return isEqual;
}
function isEqualBinary(path1, path2) {
    console.log("comparing files " + path1 + " & " + path2 + " on binary");
    if (!isOfSameSize(path1, path2)) {
        return false;
    }
    var data1 = fs.readFileSync(path1);
    var encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2);
    var encoded2 = new Buffer(data2, 'binary').toString('base64');
    return encoded1 === encoded2;
}
function isEqualJson(path1, path2) {
    // console.log("comparing files " + path1 + " & " + path2 + " on assert deep-equal")
    var json1 = fs.readFileSync(path1, 'utf-8');
    var json2 = fs.readFileSync(path2, 'utf-8');
    var res = equal(JSON.parse(json1), JSON.parse(json2));
    return res;
}
function XML2js(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, function (err, data) {
            if (err) {
                console.error(err);
            }
            parser.parseString(data, function (err, result) {
                resolve(result);
            });
        });
    });
}
function isEqualXML(path1, path2) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var self = _this;
        var result;
        var j1 = XML2js(path1);
        var j2 = XML2js(path2);
        Promise.all([j1, j2]).then(function (values) {
            result = equal(values[0], values[1]);
            resolve(result);
        });
    });
}
function isEqualPNG(path1, path2) {
    var img1 = fs.createReadStream(path1).pipe(new PNG()).on('parsed', doneReading), img2 = fs.createReadStream(path2).pipe(new PNG()).on('parsed', doneReading), filesRead = 0;
    var res;
    function doneReading() {
        if (++filesRead < 2)
            return;
        var numDiffPixels = pixelmatch(img1, img2);
        if (numDiffPixels == 0)
            res = true;
    }
    return res;
}
function isEqualjpg(path1, path2) {
    return new Promise(function (resolve, reject) {
        var res;
        imgDiff({
            actualFilename: path1,
            expectedFilename: path2,
        }).then(function (result) { return resolve(result.imagesAreSame); });
    });
}
function compareExtensionType(path1, path2, ext) {
    var _this = this;
    switch (ext) {
        case ".htm":
            return isEqualHtml(path1, path2);
            break;
        case ".html":
            return isEqualHtml(path1, path2);
            break;
        case ".json":
            return isEqualJson(path1, path2);
        case ".xml":
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, isEqualXML(path1, path2)];
                        case 1:
                            res = _a.sent();
                            resolve(res);
                            return [2 /*return*/];
                    }
                });
            }); });
            break;
        case ".jpg":
        case ".png":
            return new Promise(function (resolve, reject) {
                isEqualjpg(path1, path2).then(function (result) {
                    resolve(result);
                });
            });
            break;
        default:
            return isEqualBinary(path1, path2);
    }
}
exports.compareExtensionType = compareExtensionType;
;
