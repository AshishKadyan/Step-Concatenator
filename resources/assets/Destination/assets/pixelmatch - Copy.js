var fs = require('fs'),
    PNG = require('pngjs').PNG,
    pixelmatch = require('pixelmatch');
 
var img1 = fs.createReadStream('prev1.bmp').pipe(new PNG()).on('parsed', doneReading),
    img2 = fs.createReadStream('prev.bmp').pipe(new PNG()).on('parsed', doneReading),
    filesRead = 0;
 
function doneReading() {
    if (++filesRead < 2) return;
    var numDiffPixels = pixelmatch(img1, img2);
    console.log(numDiffPixels)
}