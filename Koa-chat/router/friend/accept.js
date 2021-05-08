const query = require('../../mysql/index');
const mysql = require('mysql');
const accept = async (ctx, next) => {
    const id=ctx.session.id;
    const {sendId}=ctx.request.body;
    const sql1=`update fdrequest set ifPass=1 where sendId=${mysql.escape(sendId)} and recvId=${mysql.escape(id)}`;
    await query(sql1);
    const sql2=`insert into friends (userId1,userId2) values (${mysql.escape(id>sendId?id:sendId)},${mysql.escape(id>sendId?sendId:id)})`
    const res=await query(sql2);
    if(res){
        ctx.response.body={
            code:200
        }
    }
}
module.exports=accept;