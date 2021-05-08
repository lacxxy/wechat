const query = require('../../mysql/index');
const mysql = require('mysql');
const fdList = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const sql = `select distinct 
    user.id,user.username as nickname,user.count as wxid,user.avatar as img,user.signature,user.area,user.sex 
    from friends,user where (friends.userId1=${id} or friends.userId2=${id}) and (user.id=friends.userId1 or user.id=friends.userId2) and user.id!=${id}`;
    const res = await query(sql);
    ctx.response.body = {
        code: 200,
        data: res
    }
}
module.exports = fdList