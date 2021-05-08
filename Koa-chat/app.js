const Router = require('koa-router') // koa 路由中间件
const koaBody = require('koa-body');
const session = require('koa-session');
const serve = require("koa-static");
const {
    app,
    ws,
    connection
} = require('./ws.js');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
}));
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认true
};
app.use(session(CONFIG, app));
app.use(serve(__dirname + "/public"));
const router = new Router(); // 实例化路由

const login = require('./router/user/login');
const search = require('./router/user/search');
const request = require('./router/friend/request');
const rqtList = require('./router/friend/rqtList');
const accept = require('./router/friend/accept');
const fdList = require('./router/friend/fdList');
const chatlist = require('./router/chat/chatlist');
const message = require('./router/chat/message');
const sendMes = require('./router/chat/sendMes');
const dltList = require('./router/chat/dltList');
const addList = require('./router/chat/addList');
const addGrp = require('./router/chat/addGrp');
const grpList = require('./router/friend/grpList');
const grpMes = require('./router/friend/grpMes');
const sendGrp = require('./router/chat/sendGrp');
const dltFrd = require('./router/friend/dltFrd');
const changeGrp = require('./router/friend/changeGrp');
const inviteGrp = require('./router/friend/inviteGrp');
const sig = require('./router/user/sig');
const uploadVideo = require('./router/chat/uploadVideo');
router.post('/login', login);
router.post('/search', search);
router.post('/request', request);
router.get('/rqtList', rqtList);
router.post('/accept', accept);
router.get('/fdList', fdList);
router.get('/chatlist', chatlist);
router.get('/message', message);
router.post('/sendMes', sendMes);
router.post('/dltList', dltList);
router.post('/addList', addList);
router.post('/addGrp', addGrp);
router.get('/grpList', grpList);
router.get('/grpMes', grpMes);
router.post('/sendGrp', sendGrp);
router.post('/dltFrd', dltFrd);
router.post('/changeGrp', changeGrp);
router.post('/inviteGrp', inviteGrp);
router.post('/sig', sig);
router.post('/uploadVideo', uploadVideo);
ws.on('connection', connection);
app.use(router.routes());
app.listen(5000);
console.log('koa is starting at port 5000');