let express = require('express');
let router = express.Router();
//获取post
let multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
let upload = require('./uploadFile');
let fs = require('fs');
let mysql = require('mysql');
let path = require('path');
/* 数据库设置 */
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cs'
});
connection.connect();
const multerLocalizedMsgs = {
    'LIMIT_PART_COUNT': '片段数量超过限制',
    'LIMIT_FILE_SIZE': '文件大小超过限制',
    'LIMIT_FILE_COUNT': '文件数量超过限制',
    'LIMIT_FIELD_KEY': '字段Name长度超过限制',
    'LIMIT_FIELD_VALUE': '字段Value长度超过限制',
    'LIMIT_FIELD_COUNT': '字段数量超过限制',
    'LIMIT_UNEXPECTED_FILE': '未知字段'
};

// 网站信息页面
router.get('/', (req, res, next) => {
    let data = 'select * from web';
    connection.query(data, (error, results, fields) => {
        if (error) throw error;
        res.render('admin/web/web', { filename: 'setting', mark: 'shezhi', data: results[0] });
    })
});
// 提交网站信息页面数据
let singleUpload = upload.single('avatar');
let multiUpload = upload.array('imgUploader', 3);
let fieldsUpload = upload.fields([
    { name: "pc_home_logo", maxCount: 1 },
    { name: "pc_child_logo", maxCount: 1 },
    { name: "wap_logo", maxCount: 1 },
    { name: "weibo_erweima", maxCount: 1 },
    { name: "weixin_erweima", maxCount: 1 }
]);
let getUrlAndRemoveFile = (req, name, oldData) => {
    let newUrl;
    if (req.files[name]) {
        // 如果有新图片上传那就读取图片信息
        let url = req.files[name][0]["path"];
        url = url.replace(/\\/g, '/');
        newUrl = url.substring(url.indexOf("/upload") + 7);
        var oldUrl = path.join(__dirname,'../../') + '/upload' + oldData[name];
        // 如果路径存在就删除
        if (fs.existsSync(oldUrl)) {
            fs.unlink(oldUrl, err => {
                if (err) throw err;
            });
        }
    } else {
        // 如果没有新图片上传就获取原信息
        newUrl = req.body[name];
    }
    return newUrl;
};
router.post('/upload', function (req, res, next) {
    fieldsUpload(req, res, function (err) {
        // console.log(req);
        // console.log(req.files);
        // console.log(req.body);
        if (err) {
            // 尝试输出本地化错误消息
            if (err.code) {
                // 图片上传出现错误提示
                res.send(multerLocalizedMsgs[err.code] || err.message);
            } else {
                res.send(err.message);
            }
            return res.end("Something went wrong!");
        }
        let readData = "select * from web";
        // 读取数据表
        connection.query(readData, (error, results, fields) => {
            if (error) res.send({ status: 0, msg: "读取数据失败" });
            // 存储老数据
            let oldData = results[0];
            let truncate = "truncate table web";
            // 清空数据表
            connection.query(truncate, (error, results, fields) => {
                if (error) res.send({ status: 0, msg: "删除数据失败" });
                let pc_home_logo, pc_child_logo, wap_logo, weibo_erweima, weixin_erweima;
                pc_home_logo = getUrlAndRemoveFile(req, "pc_home_logo", oldData);
                pc_child_logo = getUrlAndRemoveFile(req, "pc_child_logo", oldData);
                wap_logo = getUrlAndRemoveFile(req, "wap_logo", oldData);
                weibo_erweima = getUrlAndRemoveFile(req, "weibo_erweima", oldData);
                weixin_erweima = getUrlAndRemoveFile(req, "weixin_erweima", oldData);
                let insert = "INSERT INTO web"
                    + "( name, title, description, keywords, pc_home_logo, pc_child_logo, wap_logo, server_tel, server_time, weibo_erweima, weixin_erweima )"
                    + "VALUES"
                    + "('" + req.body.netName + "','" + req.body.netTitle + "','" + req.body.netDescription + "','" + req.body.netKeywords + "','"
                    + pc_home_logo + "','" + pc_child_logo + "','" + wap_logo + "','"
                    + req.body.netTel + "','" + req.body.netTime + "','" + weibo_erweima + "','" + weixin_erweima + "')";
                // 插入新数据
                connection.query(insert, (error, results, fields) => {
                    if (error) res.send({ status: 0, msg: "添加数据失败" });
                    // return res.end("File uploaded sucessfully!.");
                    if (oldData) {
                        res.send({ status: 1, msg: "修改数据成功" });
                    } else {
                        res.send({ status: 1, msg: "添加数据成功" });
                    }
                    // res.render('admin/web/web', { filename: 'setting', mark: 'shezhi', data: results[0] });
                })
            })
        });
    });
});
router.post('/singleUpload', function (req, res, next) {
    // req.file is the `avatar` file   
    // req.body will hold the text fields, if there were any   
    singleUpload(req, res, function (err) {
        console.log(req.file);
        console.log(req.body);
        if (err) {
            // 尝试输出本地化错误消息
            if (err.code) {
                res.send(multerLocalizedMsgs[err.code] || err.message);
            } else {
                res.send(err.message);
            }
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });

    res.end("上传成功");
});

//多附件上传  
//注意上传界面中的 <input type="file" name="imgUploader"/>中的name必须是下面代码中指定的名  
router.post('/mulUpload', function (req, res, next) {
    // req.files is array of `photos` files   
    // req.body will contain the text fields, if there were any   
    multiUpload(req, res, function (err) {
        console.log(req.files);
        console.log(req.body);
        if (err) {
            // 尝试输出本地化错误消息
            if (err.code) {
                res.send(multerLocalizedMsgs[err.code] || err.message);
            } else {
                res.send(err.message);
            }
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
})
router.get('/staff/list', (req, res, next) => {
    let data = 'select * from staffs';
    connection.query(data, (error, results, fields) => {
        if (error) throw error;
        res.render('admin/staff/list', { filename: 'staffList', mark: 'shezhi', data: results });
    })
    // res.render('admin/staff/list', { filename: 'staffList', mark: 'shezhi' });
})

module.exports = router;