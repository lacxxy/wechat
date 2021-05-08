const query = require('../../mysql/index');
const mysql = require('mysql');
const moment = require('moment');
const request = async (ctx, next) => {
    const sendId = ctx.session.id;
    const {
        recvId
    } = ctx.request.body;
    const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `insert into fdrequest (sendId,recvId,date,ifRead) values (${mysql.escape(sendId)},${mysql.escape(recvId)},'${currentTime}',false)`;
    const res = await query(sql);
    if (res) {
        ctx.response.body = {
            code: 200,
            msg: '请求成功!'
        }
    }
}
module.exports = request;