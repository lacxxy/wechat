const query = require('../../mysql/index');
const mysql = require('mysql');
const chatlist = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const sql = `select user.id,user.username,user.avatar,chatlist.date,chatlist.mes,chatlist.num from chatlist,user where chatlist.selfid=${id} and user.id=chatlist.chatid and chatlist.ifgroup=0 order by chatlist.date desc`;
    const sql1 = `select distinct chatgroup.groupId,chatgroup.name as username,chatlist.date,chatlist.mes,chatlist.num from chatlist,chatgroup where chatlist.selfid=${id} and chatgroup.groupId=chatlist.chatid and chatlist.ifgroup=1 order by chatlist.date desc `
    let res = await query(sql);
    res.push(...await query(sql1));
    res.sort((a, b) => {
        return b.date - a.date
    })
    if (res) {
        ctx.response.body = {
            code: 200,
            data: res
        }
    }
}
module.exports = chatlist;