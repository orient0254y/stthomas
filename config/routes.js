module.exports = function(app){
    app.get('/', function(req, res, next){
        res.render('index', {title: 'Express'});
    })
    app.get('/login',function(req, res, next){
        // console.log(res.body);
        res.send("1123");
        return;
        // res.render('admin/login', { title: 'Express' });
    })
}