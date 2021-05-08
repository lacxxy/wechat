const query = require('../../mysql/index');
const mysql = require('mysql');
const sig = async (ctx, next) => {
    const id = ctx.session.id;
    const {
        signature
    } = ctx.request.body;
    const sql = `update user set signature=${mysql.escape(signature)} where id=${id}`;
    const res = await query(sql);
    ctx.response.body = {
        code: 200,
    }
}

module.exports = sig;