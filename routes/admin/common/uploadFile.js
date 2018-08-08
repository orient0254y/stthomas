var multer = require('multer');
var md5 = require('md5');

var storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: function (req, file, callback) {
        callback(null, process.cwd() + '/upload');
    },
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, md5(Date.now()) + "." + fileFormat[fileFormat.length - 1]);
    }
});
function fileFilter(req, file, cb) {

    // 这个函数应该调用 `cb` 用boolean值来
    // 指示是否应接受该文件

    // 拒绝这个文件，使用`false`，像这样:
    cb(null, false)

    // 接受这个文件，使用`true`，像这样:
    cb(null, true)

    // 如果有问题，你可以总是这样发送一个错误:
    cb(new Error('I don\'t have a clue!'))

}
//添加配置文件到muler对象。
var upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
    filter: fileFilter,
    limits: {
        fileSize: "4mb",    // 在 multipart 表单中，文件最大长度 (字节单位)
        files: 5    // 在 multipart 表单中，文件最大数量
    },
    onFileSizeLimit: function (file) {
        //如果大于100M,删除它
        if (file.size > 100000000) {
            fs.unlink('./' + file.path) // delete the partially written file
        }
    }
});
// upload.single("image") //image为文件name
//获得文件:req.file

//多个相同name文件上传
// upload.array("image",maxCount) //image为多个相同文件name ，maxCount则为最大上传个数 ，也可以不设置
//获得文件 req.files

//多个不同name文件上传
// upload.fields([{name:'image',maxCount:'1'},{name:'txt',maxCount:'2'}])
//name 则为上传文件name  ,maxCount为该name文件最大上传个数 ,可以不设置
//获得文件 req.files.image   req.files.txt
//导出对象
module.exports = upload;