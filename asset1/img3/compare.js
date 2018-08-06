var xmlcompare = require('node-xml-compare');
 
xml1 = "<sample><a>1</a><a>2</a><a>4</a><b>4</b></sample>";
xml2 = "<sample><a>1</a><a>2</a><a>4</a><b>4</b></sample>";
 
xmlcompare(xml1, xml2, function(result) {
 console.log(result);
    //render result[-] to html page to show the xml1 nodes that are not in xml2
    //render result[+] to html page to show the xml2 nodes that are not in xml1
 
}); 