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
    res.send('upload success!');
});

//.array(fieldname,maxCount)-多文件上传
app.post('/upload-array',upload.array('logo',3),function (req, res, next) {
    // req.files 是 `logo` 文件数组
    for (var i = 0; i < req.files.length; i++) {
      fs.rename(req.files[i].path, "upload/" + req.files[i].originalname, function(err) {
            if (err) {
                throw err;
            }
        });
        console.log('文件'+(i+1)+'上传成功！');
    }
    res.send('upload success!');
});

//.fields(fields) - 多个文件上传
app.post('/upload-fields',upload.fields([{name:'logo',maxCount:2},{name:'logo2',maxCount:3}]),function (req, res, next) {
   //转存name：'logo'的文件
    for(var i = 0;i < req.files['logo'].length;i++){
        fs.rename(req.files['logo'][i].path,'upload/'+req.files['logo'][i].originalname,function (err) {
            if(err){
                throw err;
            }
        });
        console.log('logo文件'+(i+1)+'上传成功！');
    }
    // 转存name：'logo2'的文件
    for(var i = 0;i < req.files['logo2'].length;i++){
        fs.rename(req.files['logo2'][i].path,'upload/'+req.files['logo2'][i].originalname,function (err) {
            if(err){
                throw err;
            }
        });
        console.log('logo2文件'+(i+1)+'上传成功！');
    }
    res.send('upload success!');
});

//.any() - 接收所有文件上传
app.post('/upload-any',upload.any(),function (req, res, next) {
    //处理方式与第二种上传文件方式一致
    for (var i = 0; i < req.files.length; i++) {
        fs.rename(req.files[i].path, "upload/" + req.files[i].originalname, function(err) {
            if (err) {
                throw err;
            }
        });
        console.log('文件'+(i+1)+'上传成功！');
    }
    res.send('upload success!');
});

//处理form的get请求，渲染html页面
app.get('/form', function(req, res, next){
    //读取根目录的html文件
    var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
    //渲染html
    res.send(form);
});

app.listen(3009,function () {
    console.log("server at 3008 port");
});