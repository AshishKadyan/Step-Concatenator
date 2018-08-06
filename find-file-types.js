const fs = require('fs');

const XMLFolder1 = `F:\\SIMS\\Modules\\sim5service\\XMLS3\\TaskXmls2016`;
const XMLFolder2 = `F:\\SIMS\\Modules\\sim5service\\XMLS3\\TaskXmls`;

function getFilePaths(folderPath) {
    let subs = fs.readdirSync(folderPath);
    let files = [];

    subs.forEach((sub) => {
        const subPath = `${folderPath}\\${sub}`;
        if ( fs.lstatSync(subPath).isDirectory()) 
            files = files.concat(getFilePaths(subPath));
        else 
            files.push(subPath);
        
    });
    return files;
}

const set = new Set();
getFilePaths(XMLFolder1).forEach(fp => {
    if ( fp.indexOf('Assets') > -1 ) 
        set.add(fp.substring(fp.lastIndexOf('.'), fp.length).toLowerCase());
});

getFilePaths(XMLFolder2).forEach(fp => {
    if ( fp.indexOf('Assets') > -1 ) 
        set.add(fp.substring(fp.lastIndexOf('.'), fp.length).toLowerCase());
});

console.log(set, set.size);