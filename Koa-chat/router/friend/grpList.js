const query = require('../../mysql/index');
const mysql = require('mysql');
const grpList = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const sql = `select distinct 
    groupId,name from chatgroup where userId=${id}`;
    const res = await query(sql);
    ctx.response.body = {
        code: 200,
        data: res
    }
}
module.exports = grpList