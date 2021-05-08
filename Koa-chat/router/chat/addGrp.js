const query = require('../../mysql/index');
const mysql = require('mysql');
const moment = require('moment');
const addGrp = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const user = ctx.request.body.user;
    const date = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    const max = (await query(`select MAX(groupId) as maxid from chatgroup`))[0].maxid;
    let sql = `insert into chatgroup (groupId,userId,name) values (${max+1},${id},'${date}')`;
    let sql1 = `insert into chatlist (selfid,chatid,date,mes,num,ifgroup) values`;
    for (let item of user) {
        sql = `${sql},(${max+1},${item},'${date}')`;
        sql1 = `${sql1} (${item},${max+1},'${date}','无消息',0,1),`;
    }
    sql1 = sql1.substr(0, sql1.length - 1);
    await query(sql1);
    const res = await query(sql);
    if (res) {
        ctx.response.body = {
            code: 200,
        }
    }
}
module.exports = addGrp;