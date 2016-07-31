/**
 * Created by wolf on 16/7/31.
 */

var fs = require('fs');

// 创建服务器
function start() {
    // ****************开启服务器****************
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var url = require('url');

    // 处理post body
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // 监听端口
    server.listen(1888);

    // 静态文件委托
    //app.use('/live', express.static('m3u8'));   //委托ts文件
    app.use('/c', express.static('client'));   //委托客户端文件

    var seq = 0;

    // 路由
    app.get('/getm3u8', function (req, res, next) {
        //console.log('req /getm3u8  ');

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");


        //
        var m3u8Content = '#EXTM3U' + '\r\n' +
            '#EXT-X-VERSION:3' + '\r\n' +
            '#EXT-X-ALLOW-CACHE:NO' + '\r\n' +
            '#EXT-X-MEDIA-SEQUENCE:' + seq + '\r\n' +
            '#EXT-X-TARGETDURATION:6' + '\r\n' +
            '#EXTINF:5,' + '\r\n' +
            'http://127.0.0.1:1888/' + seq + '.ts' + '\r\n' +
            '#EXTINF:5,' + '\r\n' +
            'http://127.0.0.1:1888/' + (seq+1) + '.ts' + '\r\n' +
            '#EXTINF:5,' + '\r\n' +
            'http://127.0.0.1:1888/' + (seq+2) + '.ts' + '\r\n' +
            '';

        seq++;

        res.writeHead(200, {'content-type': 'application/x-mpegURL'});
        res.end(
            m3u8Content
        );
    });

    // 目前共14个文件
    app.get('/*.ts', function (req, res, next) {
        //console.log('req /*.ts  ');

        // 获取参数
        var spliceUrl = req.url.split('.');
        var index = (spliceUrl[0].split('/'))[1];

        // 计算要读取的本地文件id
        var fileIndex = (index % 14);
        var fileRealIndex = 69 + fileIndex;
        var fileName = './m3u8/' + fileRealIndex + '.ts';

        console.log('fileName = ' + fileName);

        fs.readFile(fileName, {}, function(error, fileData) {
            res.writeHead(200, {'content-type': 'application/x-mpegURL'});
            res.write(fileData);
            res.end();
        });
    });
}

// 主流程
start();