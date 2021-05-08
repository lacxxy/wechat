const query = require('../../mysql/index');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path')
const moment = require('moment');
const {
    userArr
} = require('../../ws');
const uploadVideo = async (ctx, next) => {
    const id = mysql.escape(ctx.session.id);
    const chat = mysql.escape(ctx.request.body.id);
    const file = ctx.request.files.file;
    const ifgroup = mysql.escape(ctx.request.body.ifgroup);
    const reader = fs.createReadStream(file.path);
    const date = moment(new Date()).format("yyyyMMDD HHmmss").split(' ').join('');
    const formateD = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    const name = `${date}.wav`;
    let filePath = path.join(__dirname, '../../', 'public/upload/') + `/${date}.wav`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    const sql1 = `insert into message (sendId,recvId,date,content,ifgroup,type) values (${id},${chat},'${formateD}','${name}',${ifgroup},1)`;
    await query(sql1);
    if (userArr[chat]) {
        const data = JSON.stringify({
            content: name,
            date: date,
            recvId: chat,
            sendId: id,
            avatar: avatar,
            username: username,
            ifgroup: 0,
            type: 1
        })
        userArr[chat].send(data);
    }
    ctx.response.body = {
        code: 200,
        name: name
    }
}
module.exports = uploadVideo;