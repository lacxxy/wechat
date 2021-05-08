const query = require('../../mysql/index');
const mysql = require('mysql');
const moment = require('moment');
const inviteGrp = async (ctx, next) => {
    const groupId = mysql.escape(ctx.request.body.groupId);
    const user = mysql.escape(ctx.request.body.user);
    const name = mysql.escape(ctx.request.body.name);
    const date = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    let sql = `insert into chatgroup (groupId,userId,name) values `;
    let sql1 = `insert into chatlist (selfid,chatid,date,mes,ifgroup) values `;
    for (let item of user) {
        sql = `${sql} (${groupId},${item},${name}),`
        sql1 = `${sql1} (${item},${groupId},'${date}','无消息',1),`
    }
    sql = sql.substr(0, sql.length - 1);
    sql1 = sql1.substr(0, sql1.length - 1);
    await query(sql);
    const res = await query(sql1);
    if (res) {
        ctx.response.body = {
            code: 200
        }
    }
}
module.exports = inviteGrp;