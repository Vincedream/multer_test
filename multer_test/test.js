/**
 * Created by vince on 2017/7/16.
 */
/**
 * Created by vince on 2017/7/16.
 */

var fs = require('fs');
var express = require('express');
var multer  = require('multer');

var app = express();
/*
//配制multer参数，设置上传的文件存储路径为upload
var upload = multer({ dest: 'upload/'});

//.single(fieldname) - 单个文件上传
app.post('/upload-single',upload.single('logo'),function (req,res,next) {

    // 图片会放在uploads目录没有后缀，需要自己转存，用到fs模块
    // 对文件转存，fs.rename(oldPath, newPath,callback);
    fs.rename(req.file.path, "upload/" + req.file.originalname, function(err) {
        if (err) {
            throw err;
        }
    });
    console.log('fieldname - 表单提交的文件名(input控件的name属性)： '+req.file.fieldname);
    console.log('originalname - 文件在用户设备中的原始名称： '+req.file.originalname);
    console.log('encoding - 文件的编码类型： '+req.file.encoding);
    console.log('mimetype - 文件的Mime类型： '+req.file.mimetype);
    console.log('size - 文件的大小： '+req.file.size);
    console.log('destination - 文件的保存目录(DiskStorage)： '+req.file.destination);
    console.log('filename - 文件在destination中的名称(DiskStorage)： '+req.file.filename);
    console.log('path - 上传文件的全路径(DiskStorage)： '+req.file.path);
    console.log('buffer - 文件对象的Buffer(MemoryStorage)： '+req.file.buffer);
    res.send('upload success!');
});
*/
//设置storage存储参数
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

//设置上传文件的Mime类型为video
function fileFilter(req, file, cb){
    const extension = file.mimetype.split('/')[0];
    if(extension !== 'image'){
        return cb(new Error('The file is not image type'), false);
    }
    cb(null, true);
};


//配制multer参数
var upload = multer({ storage: storage,limits:{fileSize: 160000000},fileFilter:fileFilter});

//处理上传文件
app.post('/upload-single',upload.single('logo'),function (req,res,next) {

    res.send('upload success!');
});


//处理form的get请求，渲染html页面
app.get('/form2', function(req, res, next){
    //读取根目录的html文件
    var form = fs.readFileSync('./form2.html', {encoding: 'utf8'});
    //渲染html
    res.send(form);
});

app.listen(3010,function () {
    console.log("server at 3010 port");
});