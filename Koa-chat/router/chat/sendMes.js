const query = require('../../mysql/index');
const mysql = require('mysql');
const moment = require('moment');
const fs = require('fs');
const path = require('path')
const {
    userArr
} = require('../../ws');
const sendMes = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const friend = mysql.escape(ctx.request.body.id);
    let mes = ctx.request.body.message;
    const avatar = ctx.request.body.avatar;
    const username = ctx.request.body.username;
    const text = mysql.escape(ctx.request.body.text);
    let file;
    if (ctx.request.files) {
        file = ctx.request.files.file;
    }
    const type = file ? 1 : 0;
    const date = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    if (file) {
        //语音消息
        const reader = fs.createReadStream(file.path);
        mes = moment(new Date()).format("yyyyMMDD HHmmss").split(' ').join('');
        let filePath = path.join(__dirname, '../../', 'public/upload/') + `/${mes}.wav`;
        mes = `${mes}.wav`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    }

    const sql1 = `insert into message (sendId,recvId,date,content,ifgroup,type) values (${id},${friend},'${date}','${mes}',0,${type})`;
    const sql2 = `select * from chatlist where (selfId=${id} and chatid=${friend} and ifgroup=0)`;
    const sql6 = `select * from chatlist where (selfId=${friend} and chatid=${id} and ifgroup=0)`;
    const sql3 = `update chatlist set date='${date}',mes=${text},num=num+1 where (selfId=${friend} and chatid=${id} and ifgroup=0)`
    const sql4 = `update chatlist set date='${date}',mes=${text} where (selfId=${id} and chatid=${friend} and ifgroup=0)`
    const sql5 = `insert into chatlist (selfId,chatid,date,mes,num,ifgroup) values (${id},${friend},'${date}',${text},0,0)`
    const sql7 = `insert into chatlist (selfId,chatid,date,mes,num,ifgroup) values (${friend},${id},'${date}',${text},0,0)`
    await query(sql1);
    const exit1 = (await query(sql2)).length;
    const exit2 = (await query(sql6)).length;
    let res;
    if (exit1 && exit2) {
        await query(sql3);
        res = await query(sql4)
    } else if (exit1) {
        res = await query(sql7);
    } else if (exit2) {
        res = await query(sql5);
    } else {
        await query(sql5);
        res = await query(sql7);
    }
    if (res) {
        ctx.response.body = {
            code: 200,
            content: mes
        }
    }
    if (userArr[friend]) {
        const data = JSON.stringify({
            content: mes,
            date: date,
            recvId: friend,
            sendId: id,
            avatar: avatar,
            username: username,
            ifgroup: 0,
            type: type
        })
        userArr[friend].send(data);
    }
    ctx.response.body = {
        code: 200,
        content: mes
    }
}
module.exports = sendMes;