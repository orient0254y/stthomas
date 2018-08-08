let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let admin = require('./routes/admin.js');
let index = require('./routes/index.js');
let session = require('express-session');

let app = express();
app.use(session({
    ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    //name: 'hhw',
    secret: '12345678',
    cookie: ('name', 'value', { 
        path: '/',  //表示在哪个路由下面可以访问cookie
        httpOnly: true,     //设置为true,表示只有在nodejs服务端可以操作cookie ，没法用js脚本语言操作cookie
        secure: false, 
        maxAge: 1000 * 60 * 60
    }),
    name:'session_id',/*保存在本地cookie的一个名字 默认connect.sid  可以不设置*/
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: false,     /*强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。*/
    saveUninitialized: true,      //强制将未初始化的 session 存储。  默认值是true  建议设置成true
    rolling: true   //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）

}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use('/upload',express.static(path.join(__dirname, 'upload')));

app.use('/admin', admin);
app.use('/',index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.render('error');
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
