let express = require('express');
let router = express.Router();
//获取post
let multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
let fs = require('fs');
let path = require('path');
let connection = require('./common/connection');
let upload = require('./common/uploadFile');
let pages = require('./common/pages');
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
        var oldUrl = path.join(__dirname, '../../') + '/upload' + oldData[name];
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
/* 管理员列表 */
router.get('/staffList', (req, res, next) => {
    let page = req.query.page || 1;
    // 表名，一页显示几条，当前页码,条件
    pages.getData('staffs', 10, page, " where delete_time is NULL", function (data) {
        res.render('admin/staff/list', { filename: 'staffList', mark: 'shezhi', data: data });
    });
})
// 添加管理员页面
router.get('/staffAdd', (req, res, next) => {
    let roleList = 'select * from roles where delete_time is null';
    connection.query(roleList, (err, results, fields) => {
        res.render('admin/staff/add', { filename: 'staffList', mark: 'shezhi', data: results });
    });
});
// 添加管理员操作
router.post('/staffAdd', (req, res, next) => {
    let time = new Date().getTime();
    var ip = getClientIp(req).split(':');
    ip = ip[ip.length - 1];
    let checkMsg = 'select * from staffs where delete_time is null';
    connection.query(checkMsg, (err, results, fields) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i].username === req.body.name) {
                res.send({ status: 3, msg: "用户名已存在" });
                return false;
            }
            if (results[i].email === req.body.email) {
                res.send({ status: 4, msg: "该邮箱已被注册" });
                return false;
            }
        }
        let insert = 'insert into staffs (username,password,email,role,create_time,update_time,last_login_time,last_ip)'
            + ' values ' +
            '("' + req.body.name + '","' + req.body.password + '","' + req.body.email + '","' + req.body.roleId + '","' + time + '","' + time + '","' + time + '","' + ip + '")';
        connection.query(insert, (err, results, fields) => {
            if (err) throw err;
            res.send({ status: 1, msg: "添加成功" });
        });
    });
});
// 编辑管理员
router.get('/staffEdit', (req, res, next) => {
    let select = 'select * from staffs where id="' + req.query.id + '"and username="' + req.query.name + '"and last_login_time="' + req.query.llt + '"';
    connection.query(select, (err, results, fields) => {
        if(err) throw err;
        if(results.length > 0){
            res.render('admin/staff/edit',{ filename: 'roleList', mark: 'shezhi', data: results[0] });
        }else{
            res.render('admin/error',{ filename: 'roleList', mark: 'shezhi'});
        }
    });
})
router.post('/staffEdit', (req, res, next) => {

})
// 删除管理员
router.post('/staffDel', (req, res, next) => {
    let time = new Date().getTime();
    console.log(req.body);
    
    let id = req.body.id;
    console.log('update staffs set delete_time=' + time + ' where id=' + id);
    
    connection.query('update staffs set delete_time=' + time + ' where id=' + id, (err, results, fields) => {
        if (err) throw err;
        res.send({ status: 1, msg: "删除成功" });
    });
})
/* 获取客户端ip */
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};
/* 角色管理 */
router.get('/roleList', (req, res, next) => {
    let page = req.query.page || 1;
    // 表名，一页显示几条，当前页码,条件
    pages.getData('roles', 10, page, " where delete_time is NULL", function (data) {
        res.render('admin/role/list', { filename: 'roleList', mark: 'shezhi', data: data });
    });
})
// 角色添加页面
router.get('/roleAdd', (req, res, next) => {
    res.render('admin/role/add', { filename: 'roleList', mark: 'shezhi' });
});
// 角色添加传值操作
router.post('/roleAdd', upload.single('avatar'), (req, res, next) => {
    let privileges = [];
    for (const key in req.body) {
        if (key !== 'addAdminUserName' && key !== 'roleDes') {
            privileges.push(key);
        }
    }
    var time = new Date().getTime();
    let insert = "insert into roles"
        + "(name,description,privileges,create_time,update_time)"
        + "values" + "('"
        + req.body.addAdminUserName + "','" + req.body.roleDes + "','" + privileges.join(",") + "','" + time + "','" + time + "')";

    connection.query(insert, (error, results, fields) => {
        if (error) res.send({ status: 0, msg: "添加失败" });
        res.send({ status: 1, msg: "添加成功" });
    });
});
// 角色编辑页面
router.get('/roleEdit', (req, res, next) => {
    let item = 'select * from roles where id=' + req.query.id;
    connection.query(item, (err, results, fields) => {
        if (err) throw err;
        res.render('admin/role/edit', { filename: 'roleList', mark: 'shezhi', data: results[0] });
    });
})
// 角色编辑传值操作
router.post('/roleEdit', upload.single('avatar'), (req, res, next) => {
    let privileges = [];
    for (const key in req.body) {
        if (key !== 'addAdminUserName' && key !== 'roleDes' && key !== 'id') {
            privileges.push(key);
        }
    }
    var time = new Date().getTime();
    let update = "update roles set "
        + "name='" + req.body.addAdminUserName + "',description='" + req.body.roleDes + "',privileges='" + privileges.join(",")
        + "',create_time='" + time + "',update_time='" + time + "' " + "where id=" + req.body.id;
    connection.query(update, (error, results, fields) => {
        if (error) res.send({ status: 0, msg: "修改失败" });
        res.send({ status: 1, msg: "修改成功" });
    });
});
// 角色删除操作
router.post('/roleDel', (req, res, next) => {
    if (req.body) {
        var time = new Date().getTime();
        let del = "update roles set delete_time=" + time + " where id=" + req.body.id;
        connection.query(del, (error, results, fields) => {
            if (error) res.send({ status: 0, msg: "删除失败" });
            res.send({ status: 1, msg: "删除成功" });
        })
    }
});
// 管理员日志
router.get('/logList', (req, res, next) => {
    let data = 'select * from logs';
    connection.query(data, (error, results, fields) => {
        if (error) throw error;
        res.render('admin/staff_log/list', { filename: 'logList', mark: 'shezhi', data: results });
    })
})

module.exports = router;