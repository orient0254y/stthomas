module.exports = app => {
    app.use(cookieParser());
    app.use(session({
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
        if (!sess.views) {
            // 如果session中有数据，就直接进入后台首页
            return false;
        } else {
            sess.views++;
            return true;
        }
    }
    // 首页登录设置
    /* app.get('/admin', (req, res, err) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/web/web', { title: '网站信息', filename: 'web', mark: 'shezhi' });
    }); */
    app.post('/upload', (req, res, next) => {
        console.log("------------------------");
        
        console.log(req);
        
        
    })
    // 登录进入页面
    app.get('/login', (req, res, next) => {
        res.render('admin/login', { title: '登录' });
    });
    // 登录操作
    app.post('/login', (req, res, next) => {
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
    /* 设置 */
    // 网站信息页面
    app.get('/admin/web', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        let data = 'select * from web';
        connection.query(data, (error, results, fields) => {
            if(error) throw error;
            console.log(JSON.stringify(results));
            res.render('admin/web/web', { filename: 'web', mark: 'shezhi',data: results[0] });
        })
    });
    app.post('/admin/web',(req, res, next) => {
        let params = req.body;
        /* let insert = 'insert into web (name,title,description,keywords,pc_home_logo,pc_others_logo,wap_logo,server_tel,server_time,weibo_erweima,weixin_erweima) values (' +
        params.netName + "," + params.netTile + "," + params.netDescription + "," + params.netKeywords + "," + params.netPcLogoFirst + "," + params.netPcLogoSun + "," + params.netMobileLogoFirst + "," + params.netTel + "," + params.netTime + "," + params.netWeiBoImg + "," + params.netWeiXinImg + ')';
        conenction.query(insert, (error, results, fields) => {
            if(error) throw error;
            console.log(results);
            
        }); */
    });
    // 管理员列表
    app.get('/admin/staff/list', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/staff/list', { filename: 'staffList', mark: 'shezhi' });
    });
    //角色管理
    app.get('/admin/role/list', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/role/list', { filename: 'roleList', mark: 'shezhi' });
    });
    //管理员日志
    app.get('/admin/log/list', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/staff_log/list', { filename: 'logList', mark: 'shezhi' });
    });
    /* 品牌 */
    // 发展历程
    app.get('/admin/brands/brandsDevelopments', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/brands/bdlist', { filename: 'bdlist', mark: 'pinpai' });
    })
    // 企业荣誉
    app.get('/admin/brands/brandsHonors', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/brands/bhlist', { filename: 'bhlist', mark: 'pinpai' });
    })
    // 工程案例
    app.get('/admin/brands/brandsEngineering', (req, res, next) => {
        if (!checkLogin(req, res)) return res.redirect(302, '/login');
        res.render('admin/brands/belist', { filename: 'belist', mark: 'pinpai' });
    })
};