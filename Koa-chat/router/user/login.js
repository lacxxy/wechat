const query = require('../../mysql/index');
const mysql = require('mysql');
const md5 = require('md5');
const login = async (ctx, next) => {
    let {
        count,
        password
    } = ctx.request.body;
    const saltArr = (await query(`select salt from user where count='${count}'`));
    if (!saltArr.length) {
        return ctx.response.body = {
            code: 400,
            msg: '密码错误'
        }
    }
    const salt = saltArr[0].salt;
    password = md5(`${password}${salt}`);
    const res = await query(`select * from user where count=${mysql.escape(count)} and password='${password}'`);
    if (res.length > 0) {
        ctx.response.body = {
            code: 200,
            msg: '登录成功',
            data: {
                username: res[0].username,
                avatar: res[0].avatar,
                count: res[0].count,
                signature: res[0].signature,
                area: res[0].area,
                sex: res[0].sex,
                id:res[0].id
            }
        }
        ctx.session.id = res[0].id
    } else {
        ctx.response.body = {
            code: 400,
            msg: '密码错误'
        }
    }
}
module.exports = login;