let express = require('express');
let router = express.Router();

let login = require('./admin/login');
let setting = require('./admin/setting');

/*权限判断*/
router.use(function (req, res, next) {
    //next();
    if (req.url == '/login' || req.url == '/login/doLogin') {
        next();
    } else {
        if (req.session.userinfo && req.session.userinfo.username != '') {   /*判断有没有登录*/
            //app.locals  全局
            //req.app.locals  /*请求的全局*/
            req.app.locals['userinfo'] = req.session.userinfo;   /*配置全局变量  可以在任何模板里面使用*/
            next();
        } else {
            res.redirect('/admin/login');
        }
    }
})
router.use('/login', login);
router.use('/', setting);
router.use('/setting', setting);


module.exports = router;
