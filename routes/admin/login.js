let express = require('express');
let router = express.Router();
let cookieParser = require('cookie-parser');
let mysql = require('mysql');
/* 数据库设置 */
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cs'
});
connection.connect();
router.use(cookieParser());
router.get('/', (req, res, next) => {
    res.render('admin/login', { title: '登录' });
});
router.post('/doLogin', (req, res, next) => {
    let params = req.body;
    let data = {
        "status": 0,
        "msg": ""
    }
    // 查询数据表
    connection.query('SELECT * FROM users', (error, results, fields) => {
        if (error) throw error;
        let exist = false;
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            // 如果名字和密码均正确，就可以登录成功了，然后渲染首页
            if (element.name === params.name && element.password === params.password) {
                exist = true;
                res.cookie("stthomas_username", element.name);
                res.cookie("stthomas_userid", element.id);
                data.msg = "登录成功";
                data.status = 1;
                req.session.views = 1;
                req.session.userinfo = element.name;
                res.send(data);
            }
        }
        // 否则返回错误信息
        if (!exist) {
            data.msg = "用户名或密码不正确";
            // res.render('admin/login');
            res.send(data);
        } else {
            /* var addOne = 'insert into users (name, password) values (' + params.name + ',' + params.password + ')';
            connection.query(addOne, (error, results, fields) => {
                if (results.insertId) {
                    data.msg = "注册成功";
                    data.status = 1; 
                }
                res.send(data);
            }); */

        }

    });
});

module.exports = router;