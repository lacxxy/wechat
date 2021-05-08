const query = require('../../mysql/index');
const mysql = require('mysql');
const grpMes = async (ctx, next) => {
    const id = mysql.escape(ctx.request.query.id);
    const sql = `select user.id,user.username,user.avatar,chatgroup.name
    from chatgroup,user where chatgroup.groupId=${id} and user.id=chatgroup.userId`;
    const res = await query(sql);
    ctx.response.body = {
        code: 200,
        data: res
    }
}
module.exports = grpMes