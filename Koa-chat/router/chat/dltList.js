const query = require('../../mysql/index');
const mysql = require('mysql');
const dltList = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const chat = mysql.escape(ctx.request.body.id);
    const type = mysql.escape(ctx.request.body.type);
    const sql = `delete from chatlist where selfid=${id} and chatid=${chat} and ifgroup=${type}`;
    const res = await query(sql);
    if (res) {
        ctx.response.body = {
            code: 200,
        }
    }
}
module.exports = dltList;