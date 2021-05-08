const query = require('../../mysql/index');
const mysql = require('mysql');
const dltFrd = async (ctx, next) => {
    const id = ctx.session.id;
    const {
        userId,
        type
    } = ctx.request.body;
    let sql = `delete from friends where (userId1=${mysql.escape(id)} and userId2=${mysql.escape(userId)}) or (userId1=${mysql.escape(userId)} and userId2=${mysql.escape(id)})`;
    if (type == 1) {
        sql = `delete from chatgroup where (groupId=${mysql.escape(userId)} and userId=${mysql.escape(id)})`
    }
    await query(sql);
    let sql1 = `delete from chatlist where (selfid=${mysql.escape(id)} and chatid=${mysql.escape(userId)} and ifgroup=${mysql.escape(type)})`
    const res = await query(sql1);
    if (res) {
        ctx.response.body = {
            code: 200
        }
    }
}
module.exports = dltFrd;