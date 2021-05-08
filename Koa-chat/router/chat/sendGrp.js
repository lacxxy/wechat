const query = require('../../mysql/index');
const mysql = require('mysql');
const moment = require('moment');
const fs = require('fs');
const path = require('path')
const {
    userArr
} = require('../../ws');
const sendGrp = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const friend = mysql.escape(ctx.request.body.id);
    let mes = ctx.request.body.message;
    const avatar = ctx.request.body.avatar;
    const username = ctx.request.body.username;
    const text = mysql.escape(ctx.request.body.text);
    const date = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    let file;
    if (ctx.request.files) {
        file = ctx.request.files.file;
    }
    const type = file ? 1 : 0;
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

    const sql1 = `insert into message (sendId,recvId,date,content,ifgroup,type) values (${id},${friend},'${date}','${mes}',1,${type})`;
    const sql2 = `select * from chatlist where (selfId=${id} and chatid=${friend} and ifgroup=1)`;
    const sql3 = `update chatlist set date='${date}',mes=${text},num=num+1 where (chatid=${friend} and ifgroup=1)`
    const sql4 = `update chatlist set date='${date}',mes=${text},num=0 where (selfId=${id} and chatid=${friend} and ifgroup=1)`
    const sql5 = `select userId from chatgroup where groupId=${friend} and userId!=${id}`;
    let sql6 = `insert into chatlist (selfId,chatid,date,mes,num,ifgroup) values (${id},${friend},'${date}',${text},0,1)`
    const user = await query(sql5);
    for (let item of user) {
        sql6 = `${sql6},(${item.userId},${friend},'${date}',${text},0,1)`
    }
    await query(sql1);
    const exit = (await query(sql2)).length;
    let res;
    if (exit) {
        await query(sql3);
        res = await query(sql4)
    } else {
        res = await query(sql6);
    }
    if (res) {
        ctx.response.body = {
            code: 200,
            content:mes
        }
    }
    for (let item of user) {
        if (userArr[item.userId]) {
            const data = JSON.stringify({
                content: mes,
                date: date,
                recvId: friend, //群聊id
                sendId: id, //发送的用户id
                avatar: avatar,
                username: username,
                ifgroup: 1,
                type: type
            })
            userArr[item.userId].send(data);
        }
    }
    ctx.response.body = {
        code: 200,
        content: mes
    }
}
module.exports = sendGrp;