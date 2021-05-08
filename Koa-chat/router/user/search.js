const query = require('../../mysql/index');
const mysql = require('mysql');
const search = async (ctx, next) => {
    const {
        wxid
    } = ctx.request.body;
    const sql = `select id,count,username,avatar,signature,area,sex from user where count=${mysql.escape(wxid)}`;
    const res = await query(sql);
    try {
        if (res.length > 0) {
            ctx.response.body = {
                code: 200,
                data: res[0]
            }
        } else {
            ctx.response.body = {
                code: 200,
                data: []
            }
        }
    } catch {
        ctx.response.body = {
            code: 500,
        }
    }
}

module.exports = search;