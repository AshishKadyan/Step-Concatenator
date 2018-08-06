"use strict";
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
    console.log("hrerere");
    console.log("comparing files " + path1 + " & " + path2 + " on assert deep-equal");
    var json1 = fs.readFileSync(path1, 'utf-8');
    var json2 = fs.readFileSync(path2, 'utf-8');
    var res = equal(JSON.parse(json1), JSON.parse(json2));
    console.log(res);
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
            console.log(values);
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
        console.log(numDiffPixels);
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
    switch (ext) {
        case ".htm":
            return isEqualHtml(path1, path2);
        case ".html":
            return isEqualHtml(path1, path2);
        case ".png":
            return isEqualPNG(path1, path2);
        case ".json":
            return isEqualJson(path1, path2);
        case ".xml":
            isEqualXML(path1, path2).then(function (res) {
                return res;
            });
        case ".jpg":
            isEqualjpg(path1, path2).then(function (result) {
                console.log(result);
                return result;
            });
            break;
        default:
            return isEqualBinary(path1, path2);
    }
}
exports.compareExtensionType = compareExtensionType;
;
