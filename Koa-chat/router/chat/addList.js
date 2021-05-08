const query = require('../../mysql/index');
const mysql = require('mysql');
const moment = require('moment');
const addList = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const type = mysql.escape(ctx.request.body.type | 0);
    const chat = mysql.escape(ctx.request.body.id);
    const date = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    let sql = `insert into chatlist (selfid,chatid,date,mes,num,ifgroup) values (${id},${chat},'${date}','无消息',0,${type})`;
    const res = await query(sql);
    if (res) {
        ctx.response.body = {
            code: 200,
        }
    }
}
module.exports = addList;