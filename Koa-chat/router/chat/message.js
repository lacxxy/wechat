const query = require('../../mysql/index');
const mysql = require('mysql');
const message = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const friend = mysql.escape(ctx.request.query.id);
    const type = ctx.request.query.type;
    let sql = `select * from message where (ifgroup=0 or ifgroup is null) and ((sendId=${id} and recvId=${friend}) or (sendId=${friend} and recvId=${id}))`;
    let sql1 = `update chatlist set num=0 where (selfid=${id} and chatid=${friend})`;
    if (type == 1) {
        sql = `select message.*,user.id,user.avatar from message,user where (message.recvId=${friend}) and message.ifgroup=1 and user.id=message.sendId order by message.date`;
        sql1 = `update chatlist set num=0 where (selfid=${id} and chatid=${friend} and ifgroup=1)`;
    }
    const res = await query(sql);
    await query(sql1);
    if (res) {
        ctx.response.body = {
            code: 200,
            data: res
        }
    }
}
module.exports = message