import { promises } from "fs";
import { resolve } from "path";
import { rejects } from "assert";

var xml2js = require('xml2js');
var parser = xml2js.Parser();
const fs = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const equal = require("deep-equal");
var assert = require('assert');
var PNG = require('pngjs').PNG,
var pixelmatch = require('pixelmatch');
const { imgDiff } = require('img-diff-js');

function isOfSameSize(path1, path2): boolean {
    return fs.statSync(path1).size === fs.statSync(path2).size;
}

function isEqualHtml(path1: string, path2: string): boolean {
    console.log("comparing files " + path1 + " & " + path2 + " on HTML-differ");
    const html1 = fs.readFileSync(path1, 'utf-8');
    const html2 = fs.readFileSync(path2, 'utf-8');
    const options = {
        ignoreAttributes: [],
        compareAttributesAsJSON: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false
    };
    const htmlDiffer = new HtmlDiffer(options);
    const diff = htmlDiffer.diffHtml(html1, html2),
        isEqual = htmlDiffer.isEqual(html1, html2),
        res = logger.getDiffText(diff, { charsAroundDiff: 40 });
    // logger.logDiffText(diff, { charsAroundDiff: 40 });
    return isEqual;
}

function isEqualBinary(path1: string, path2: string): boolean {
    console.log("comparing files " + path1 + " & " + path2 + " on binary")
    if (!isOfSameSize(path1, path2)) {
        return false;
    }
    var data1 = fs.readFileSync(path1);
    const encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2);
    const encoded2 = new Buffer(data2, 'binary').toString('base64');

    return encoded1 === encoded2;
}

function isEqualJson(path1, path2): boolean {
    console.log("hrerere")
    console.log("comparing files " + path1 + " & " + path2 + " on assert deep-equal")
    const json1 = fs.readFileSync(path1, 'utf-8');
    const json2 = fs.readFileSync(path2, 'utf-8');
    const res = equal(JSON.parse(json1), JSON.parse(json2));
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

            })
        })
    })
}
function isEqualXML(path1, path2): Promise<boolean{
    return new Promise((resolve, reject) => {
        let self = this
        let result: boolean
        let j1 = XML2js(path1)
        let j2 = XML2js(path2)
        Promise.all([j1, j2]).then(values => {
            console.log(values)
            result = equal(values[0], values[1])
            resolve(result)
        })

    })

}
function isEqualPNG(path1, path2) {
    var img1 = fs.createReadStream(path1).pipe(new PNG()).on('parsed', doneReading),
        img2 = fs.createReadStream(path2).pipe(new PNG()).on('parsed', doneReading),
        filesRead = 0;
    let res: boolean;
    function doneReading() {
        if (++filesRead < 2) return;
        var numDiffPixels = pixelmatch(img1, img2);
        console.log(numDiffPixels)
        if (numDiffPixels == 0)
            res = true;
    }
    return res
}
function isEqualjpg(path1, path2) {
    return new Promise((resolve, reject) => {

        var res: boolean
        imgDiff({
            actualFilename: path1,
            expectedFilename: path2,

        }).then(result => resolve(result.imagesAreSame));
    })

}
export function compareExtensionType(path1: string, path2: string, ext: string): boolean {
    switch (ext) {
        case ".htm":
            return isEqualHtml(path1, path2);

        case ".html":
            return isEqualHtml(path1, path2);
        // case ".png":
        //     return isEqualPNG(path1, path2);

        case ".json":
            return isEqualJson(path1, path2)
        case ".xml":
            isEqualXML(path1, path2).then(res => {
                return res
            })
        case ".jpg":
            isEqualjpg(path1, path2).then(result => {
                console.log(result)
                return result
            })
            break
        default:
            return isEqualBinary(path1, path2);
    }
};
