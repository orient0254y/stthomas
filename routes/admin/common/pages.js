let connection = require('./connection');
// 表名，一页显示几条，当前页码
function GetPageData() { }
GetPageData.prototype = {
    getData: function (table, rows, page,condition, callback) {
        this.rows = rows;
        let scope = this;
        this.getTotalPage(table, function (results) {
            scope.getPage(table, page, results,condition, callback);
        })
    },
    getTotalPage: function (table, callback) {
        let getTotal = 'select count(*) from ' + table;
        connection.query(getTotal, (err, results, fields) => {
            if (err) throw err;
            callback && callback(results[0]['count(*)']);
        });
    },
    getPage: function (table, page, total,condition, callback) {
        let getPage = 'select * from ' + table + condition + ' limit ' + (parseInt(page) - 1) * parseInt(this.rows) + ',' + this.rows;
        let pages = Math.ceil(parseInt(total) / parseInt(this.rows));
        connection.query(getPage, (err, results, fields) => {
            if (err) throw err;
            var data = {
                total: total,
                pages: pages,
                list: results
            }
            callback && callback(data);
        });
    }
}
module.exports = new GetPageData();