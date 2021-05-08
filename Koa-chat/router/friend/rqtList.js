const query = require('../../mysql/index');
const mysql = require('mysql');
const rqtList = async (ctx, next) => {
    const id=ctx.session.id;
    const sql=`select fdrequest.*,user.id as userid,user.username,user.avatar from fdrequest,user where fdrequest.recvId=${mysql.escape(id)} and fdrequest.sendId=user.id`;
    const res= await query(sql);
    if(res){
        ctx.response.body={
            code:200,
            data:res
        }
    }
}
module.exports=rqtList;