let express = require('express');
let router = express.Router();
//获取post
let multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
let upload = require('./uploadFile');
let mysql = require('mysql');
/* 数据库设置 */
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cs'
});
connection.connect();


// 网站信息页面
router.get('/', (req, res, next) => {
    let data = 'select * from web';
    connection.query(data, (error, results, fields) => {
        if (error) throw error;
        res.render('admin/web/web', { filename: 'setting', mark: 'shezhi', data: results[0] });
    })
});
// 提交网站信息页面数据
router.post('/upload', upload.single('avatar'), function (req, res, next) {
    if (req.file) {
        res.send('文件上传成功')
        console.log(req.file);
        console.log(req.body);
    }
});

router.get('/staff/list', (req, res, next) => {
    res.render('admin/staff/list', { filename: 'staffList', mark: 'shezhi' });
})

module.exports = router;