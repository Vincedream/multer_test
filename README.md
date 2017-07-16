Express中有各种上传文件的中间件，其中Multer的高效性值得我们去使用，他是Express官方推出的只用于处理multipart/form-data请求数据的中间件，但是官方文档中的说明并不是很清楚，对新手来说并不是特别友好，以下是我学习Multer的学习笔记，希望能给大家带来一些价值～

# 准备工作
1、创建一个文件夹multer_test，cd到该文件夹，输入以下命令新建工程，一路enter回车过去。

```
npm init
```
2、下载需要的安装包

```
npm install express multer -save
```
3、根目录下新建app.js，输入以下代码：

```
/**
 * Created by vince on 2017/7/16.
 */
var fs = require('fs');
var express = require('express');
var multer  = require('multer');

var app = express();
app.get('/form', function(req, res, next){
    //读取根目录的html文件
    var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
    //渲染html
    res.send(form);
});

app.listen(3009,function () {
    console.log("server at 3008 port");
});
```
4、根目录下创建form.html文件，输入代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Multer</title>
</head>
<body>
<h2>Multer Test</h2>
</body>
</html>
```
5、运行app.js，浏览器打开：http://localhost:3008/form

```
node app.js
```
运行效果：

![image](http://osutuwgm1.bkt.clouddn.com/6FF1EBA1-B39C-41A1-AFD0-4F732A5F15C1.png)


6、准备工作完成，开始coding吧～

# Multer的使用
## 1、single(fieldname) - 单个文件上传
接收一个名为fieldname的上传文件，所上传的文件会被保存在req.file。
- 在app.js文件中修改以下代码：

```
/**
 * Created by vince on 2017/7/16.
 */
var fs = require('fs');
var express = require('express');
var multer  = require('multer');

var app = express();

//配制multer参数，设置上传的文件存储路径为upload
var upload = multer({ dest: 'upload/'})

//.single(fieldname) - 单个文件上传
app.post('/upload-single',upload.single('logo'),function (req,res,next) {
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
```
- 在form.html文件中修改以下代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Multer</title>
</head>
<body>
<h2>Multer Test</h2>
<form action="/upload-single" method="post" enctype="multipart/form-data">
    <h3>单文件上传</h3>
    <input type="file" name="logo">

    <input type="submit" value="提交">
</form>
</body>
</html>
```
- 代码解读：

1. upload.single('logo')要和html中的input type="file" name="logo"要吻合，upload.single的功能是只上传单个文件，并且指定inpiut中的name。
2. 在html中的form表单中enctype必须要为"multipart/form-data"，因为multer只处理multipart/form-data请求数据。
- 重启app.js，运行代码
![image](http://osutuwgm1.bkt.clouddn.com/99946F0B-0587-438D-8819-E268F9638934.png)


试试上传一个文件，会发现在根目录中多出了一个文件夹upload，里面还有一个二进制格式的文件，这就是我们上传的文件啦，二进制文件在一些环境下是打不开的，那我们怎么转换为正常格式的文件呢，不急，我们看下一步。
![image](http://osutuwgm1.bkt.clouddn.com/74DDF515-64F2-4B77-B256-4713AD140CC3.png)

- 将二进制文件转换为普通文件：
打开app.js，修改post为：

```
app.post('/upload-single',upload.single('logo'),function (req,res,next) {
    / 图片会放在uploads目录没有后缀，需要自己转存，用到fs模块
    // 对文件转存，fs.rename(oldPath, newPath,callback);
    fs.rename(req.file.path, "upload/" + req.file.originalname, function(err) {
        if (err) {
            throw err;
        }
    });
    res.send('upload success!');
});
```
重启app.js，再次上传文件，发现上传的文件已经带有后缀，转换成普通打得开的文件啦～

如图：
![image](http://osutuwgm1.bkt.clouddn.com/BC914FCF-B188-429F-8E97-EBDA2D2D0AB9.png)

- 好啦，一个简单的multer上传文件例子完成啦，但是multer还有其他强大功能，我们接着往下看吧～

## 2、.array(fieldname,maxCount)-多文件上传
接收名为fieldname的，多个上传文件数组。可选参数maxCount表示可接受的文件数量，上传文件数超出该参数指定的数据后会抛出一个错误。文件数组会被保存在req.files数组中。
- 在app.js中添加以下代码

```
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
```
- 在form.html中添加以下代码

```
<form action="/upload-array" method="post" enctype="multipart/form-data">
    <h3>2.array(fieldname,maxCount)-多文件上传</h3>

    文件1：<input type="file" name="logo"> <br>
    文件2：<input type="file" name="logo"> <br>
    文件3：<input type="file" name="logo"> <br>
    <input type="submit" value="提交">
</form>
```
- 代码解读
1. 多文件上传的req.files和单文件上传的req.file的区别是“s”，多文件就是files，单文件是file，千万不能弄混了。
2. req.files是一个文件数组，所以要循环req.files[i];

- 重启app.js，上传文件

上传文件：

![image](http://osutuwgm1.bkt.clouddn.com/0E2EAA9F-9601-4CF4-8C5B-BD424D45ED63.png)

上传结果：

![image](http://osutuwgm1.bkt.clouddn.com/FB56D23A-3BEA-4778-A0B6-BEBCB6663E1B.png)

其实这个array文件上传是有限制性的，我们注意到，在html中的表单中form的name="logo"必须一致，也就是说在一个form中要上传多个文件，name必须是一致的，这在我们实际开发中显然达不到要求，那么有没有办法解决呢，当然有，别忘了，multer是强大的，往下面接着看吧～

## 3、fields(fields) - 多个文件上传(多域上传)
接收通过fields指定的多个上传文件。文件数组对象会被保存在req.files中。fields是一个包含对象的数组，对象中会包含name和maxCount两个属性：

```
[
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]
```
从fields的英文字义来看是“田野”的意思，我们顾名思义，一块田野中可以种植各种蔬菜，并且可以规定每种蔬菜的数量，那么name就是input标签中的name=‘’，maxCount就是form表单中每种文件上传的个数。
- 在app.js中添加以下代码：

```
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
```

- 在html中添加以下代码：

```
<form action="/upload-fields" method="post" enctype="multipart/form-data">
    <h3>fields(fields) - 多个文件上传</h3>
    1 <input type="file" name="logo"> <br>
    2 <input type="file" name="logo"><br>
    3 <input type="file" name="logo2"><br>
    4 <input type="file" name="logo2"><br>

    <input type="submit" value="提交">
</form>
```

- 代码解读

1、fields(fields)中的参数与html中input标签中的name一一匹配
2、req.files['logo']和req.files['logo2']分别是连个文件数组，所以用两个for循环转存。
- 重启app.js，上传文件

如图：

![image](http://osutuwgm1.bkt.clouddn.com/071DFD99-DFB6-4E72-AEED-43C02373C718.png)

上传结果如图：

![image](http://osutuwgm1.bkt.clouddn.com/5CA98826-BEC5-4BA4-84E3-3A2DB33D6954.png)

小伙伴们是不是觉得这种上传方式有点繁琐，那么没关系，下面还有一种文件上传方式，非常简便哦，我们一起来看吧

## 4、.any() - 接收所有文件上传
接收请求中的所有文件。上传文件数组会被保存在req.files中，这种方式没有多余的限制，比较便捷。
- 在app.js中添加以下代码：

```
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
```

- 在html中添加以下代码：

```
<form action="/upload-any" method="post" enctype="multipart/form-data">
    <h3>4.any() - 接收所有文件上传</h3>
    文件1: <input type="file" name="logo"> <br>
    文件2: <input type="file" name="logo"><br>
    文件3: <input type="file" name="logo2"><br>
    <input type="submit" value="提交">
</form>
```
- 代码解读
1、文件数组保存在req.files中，与第二种上传方式一致
2、在html中input标签中不必要严格设置name的属性，比较便捷
- 重启app.js，运行

上传文件如图：

![image](http://osutuwgm1.bkt.clouddn.com/806E1FBB-4541-4CF4-B41A-2794917BC72E.png)

查看结果如图：

![image](http://osutuwgm1.bkt.clouddn.com/4F3E1F1F-9642-4EA2-ADF7-559E3F23506B.png)

以上是multer四种上传文件的方式，以上例子都是比较简单的例子，在实际开发当中我们还有其他的要求，multer也给我们提供了这些API，我们接着往下看吧～

# Multer其他“骚”操作
- 准备工作

为了和上面的app.js区分开，我们新建一个test.js，输入以下代码，并且将端口改为3010:

```
/**
 * Created by vince on 2017/7/16.
 */

var fs = require('fs');
var express = require('express');
var multer  = require('multer');

var app = express();

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
```
新建form2.html，输入以下代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h2>Multer Other Test</h2>
<form action="/upload-single" method="post" enctype="multipart/form-data">
    <h3>Multer其他功能</h3>
    文件1：<input type="file" name="logo">
    <input type="submit" value="提交">
</form>
</body>
</html>
```
准备工作完成啦，我们来看看Multer还有其他哪些骚操作把～

## 1、文件对象
multer解析完上传文件后，会被保存为一个包含以下字段的对象：


属性 | 解释
---|---
fieldname|表单提交的文件名(input控件的name属性)
originalname|文件在用户设备中的原始名称
encoding|文件的编码类型
mimetype|文件的Mime类型
size|文件的大小
destination|文件的保存目录(DiskStorage)
filename|文件在destination中的名称(DiskStorage)
path|上传文件的全路径(DiskStorage)
buffer|文件对象的Buffer(MemoryStorage)

那么问题来了，我们需要这些有什么用呢？当我们上传文件到后台以后，我们想要获得文件的详细数据与属性，我们就能通过这个来获得啦～
- 修改test.js中的代码，添加以下代码

```
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
```

- 在form2.html中添加以下代码：

```
<h2>Multer Other Test</h2>
<form action="/upload-single" method="post" enctype="multipart/form-data">
    <h3>Multer其他功能</h3>
    文件1：<input type="file" name="logo">
    <input type="submit" value="提交">
</form>
```

- 运行test.js
- 访问 http://localhost:3010/form2
- 上传文件
![image](http://osutuwgm1.bkt.clouddn.com/5B281DCB-689C-401C-86F5-4D3E134D86B2.png)
- 查看控制台中输出信息：
![image](http://osutuwgm1.bkt.clouddn.com/E4FC9C78-D793-4C7D-B1E5-1F2783DB2416.png)


## 2、选项参数
Multer的选项对象中可以包含以下值：

- dest或storage - 文件存储位置
- fileFilter - 函数，控制可上传的文件类型
- limits - 上传数据限制(文件大小)

### 1.storage - 存储引擎
.diskStorage(obj)与硬盘存储,该选项有以下两个可选项：

- destination - 硬盘存储，用于设置文件的存储目录，可以是一个函数或字符串。若未提供该参数，将使用系统的临时目录。
- filename - 内存存储，用于设置文件名。若未提供该参数，将使用一个随机字符串，且文件名中不包含扩展名。

示例：

```
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })
```
我们可以使用这个来做什么呢？上面我解释四种文件上传方式的时候，每个post函数中都有一个用来转存文件的函数，显得非常臃肿，其实Multer早就为我们考虑到这一点了，我们开始codeing使用他吧～

- 注释以下代码：
![image](http://osutuwgm1.bkt.clouddn.com/7599D146-177D-44A7-A23E-C3CAE24B2440.png)

- 在app.js中添加以下代码：

```
//设置storage存储参数
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

//配制multer参数
var upload = multer({ storage: storage });

//处理上传文件
app.post('/upload-single',upload.single('logo'),function (req,res,next) {

    res.send('upload success!');
});
```

- 重启test.js，上传文件，发现效果和fs处理效果是一致的。

### 2.limits - 文件尺寸
该选项用于设置文件尺寸，Multer 会将这个对象传递至busboy中。limits对象中可以包含以下可选值：


参数 | 解释
---|---
fieldNameSize|字段名最大尺寸。默认值：100 bytes
fieldSize|字段值最大尺寸。默认值：1MB
fields|非文件字段的最大数量。默认值：Infinity
fileSize| multipart 表单中，文件的最大尺寸。默认值：Infinity
files|multipart 表单中，文件最大数量。默认值：Infinity
parts|multipart 表单中，最大组件(fields+files)数量。默认值：Infinity
headerPairs|默认值：2000
|
那么这些又有什么用呢？假设我们不想浪费服务器的流量，只允许客户端上传小于10MB的文件，那么我们就可以利用这个功能啦～
- 在app.js中修改以下代码：

```
//配制multer参数，设置上传的文件存储路径为upload,上传文件小于160kB，默认单位为B，所以160000B=160kB
var upload = multer({ storage: storage,limits:{fileSize: 160000}});

```
- 重启test.js，上传文件，大于160kb的文件会显示上传失败

### 3.fileFilter - 文件筛选

fileFilter用于控制要哪些文件是可接受的，哪些是要被拒绝的。使用形式如下：

```
function fileFilter (req, file, cb) {

  // 需要调用回调函数 `cb`，
  // 并在第二个参数中传入一个布尔值，用于指示文件是否可接受

  // 如果要拒绝文件，上传则传入 `false`。如:
  cb(null, false)

  // 如果接受上传文件，则传入 `true`。如:
  cb(null, true)

  // 出错后，可以在第一个参数中传入一个错误：
  cb(new Error('I don\'t have a clue!'))
}
```
那么这个又有什么用呢，假设当上传的文件必须为统一格式，比如image的话，那我们就能用上这个功能啦～
- 在test.js中的添加以下代码：

```
//设置上传文件的Mime类型为video
function fileFilter(req, file, cb){
    const extension = file.mimetype.split('/')[0];
    if(extension !== 'image'){
        return cb(new Error('The file is not image type'), false);
    }
    cb(null, true);
};
```
- 并且修改multer参数

```
//配制multer参数
var upload = multer({ storage: storage,limits:{fileSize: 160000000},fileFilter:fileFilter});

```
- 重启test.js，当上传其他格式文件时，显示上传错误

Multer中的几个“骚”操作我们差不多总结完啦，Multer是开发中非常常见的中间件，对于其掌握是非常必要的～
# 总结
- 因为官方文档对于multer解释不太清楚，小白看了会懵逼，所以才有了这一篇博文，希望能够帮助到一些刚刚入门Express的小伙伴们，也是自己巩固知识的好机会。
- 代码已经上传到[GitHub](https://github.com/Vincedream/multer_test)啦，运行之前别忘记npm install哦，如果对你有帮助，给个star鼓励下啦～
- Nice to meet you ～
