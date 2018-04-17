var http = require('http');
var crypto = require('crypto');
var fs = require('fs');

var q = 'begin';
var from = 'EN';
var to = 'zh-CHS';
var salt = Math.random();
var appKey = '7122525dce1a80df';
var secureKey = 'ta9GYAsEWDd9dfY2PdCil7AjfPZEK1jP';

//开始清空文件

fs.writeFile('result.txt','',{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
    if(err){
        console.log("文件写入失败")
    }else{
        //console.log("文件写入成功");
    }
});

// 异步读取// 同步读取
var data = fs.readFileSync('yourWord.txt');
//匹配换行符
data = data.toString().split('\r\n');

for(var i = 0;i<data.length;i++){
    (function(){
        // 闭包
        q = data[i];
        var strP = q + ' ';
        var md5 = crypto.createHash('md5');
        var salt = Math.random();
        var sign = md5.update(appKey+q+salt+secureKey).digest('hex').toUpperCase();

        var url = 'http://openapi.youdao.com/api?q='+q+'&from='+
            from+'&to='+to+'&appKey='+appKey+'&salt='+salt+'&sign='+sign;
        http.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('请求失败。\n' +
                            `状态码: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('无效的 content-type.\n' +
                            `期望 application/json 但获取的是 ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // 消耗响应数据以释放内存
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
            const parsedData = JSON.parse(rawData);

            var len2 = parsedData.basic.explains.length;
            

            while(len2--){
                strP += parsedData.basic.explains[len2]+' ';
            }

            console.log(strP);

            //写入文件加上换行符 a 追加
            fs.writeFile('result.txt',strP+'\n',{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
                if(err){
                    console.log("文件写入失败")
                }else{
                    //console.log("文件写入成功");
                }
            });


            } catch (e) {
            console.error(e.message);
            }
        });
        }).on('error', (e) => {
        console.error(`错误: ${e.message}`);
        });



    })();
}
