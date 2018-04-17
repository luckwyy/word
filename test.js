var http = require('http');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var q = 'good';
var from = 'EN';
var to = 'zh-CHS';
var appKey = '7122525dce1a80df';
var salt = Math.random();
var secureKey = 'ta9GYAsEWDd9dfY2PdCil7AjfPZEK1jP';
var sign = '';



sign = md5.update(appKey+q+salt+secureKey).digest('hex').toUpperCase();



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
      console.log(parsedData.basic.explains[0]);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`错误: ${e.message}`);
});