const { imgDiff } = require('img-diff-js');

imgDiff({
  actualFilename: './prev.bmp',
  expectedFilename: './prev1.bmp',
  diffFilename: 'example/diff.png',
}).then(result => console.log(result));