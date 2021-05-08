const query = require('../../mysql/index');
const mysql = require('mysql');
const changeGrp = async (ctx, next) => {
    const id = ctx.session.id;
    const groupId = mysql.escape(ctx.request.body.groupId);
    const name = mysql.escape(ctx.request.body.name);
    const sql = `update chatgroup set name=${name} where groupId=${groupId}`;
    const res = await query(sql);
    if (res) {
        ctx.response.body = {
            code: 200
        }
    }
}
module.exports = changeGrp;