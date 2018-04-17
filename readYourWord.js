var fs = require('fs');

// 异步读取
fs.readFile('yourWord.txt', function (err, data) {
    if (err) {
        return console.error(err);
    }
    var wordArray = data.toString().split(' ');
    //console.log();
    var wl = wordArray.length;
    while(wl--){
        console.log(wordArray[wl]);
    }
});