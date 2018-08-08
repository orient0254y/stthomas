let express = require('express');
let router = express.Router();
let session = require('express-session');
router.use(session({
    ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    //name: 'hhw',
    secret: '12345678',
    cookie: ('name', 'value', { 
        path: '/',  //表示在哪个路由下面可以访问cookie
        httpOnly: true,     //设置为true,表示只有在nodejs服务端可以操作cookie ，没法用js脚本语言操作cookie
        secure: false, 
        maxAge: 300000 
    }),
    name:'session_id',/*保存在本地cookie的一个名字 默认connect.sid  可以不设置*/
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: false,     /*强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。*/
    saveUninitialized: true,      //强制将未初始化的 session 存储。  默认值是true  建议设置成true
    rolling: true   //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）

}))
// 进入任何页面均检测
const checkLogin = (req, res) => {
    let sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
    console.log(sess);
    
    if (!sess.views) {
        // 如果session中有数据，就直接进入后台首页
        res.redirect(302, '/login');
        return false;
    } else {
        sess.views++;
        return true;
    }
}

module.exports = checkLogin;