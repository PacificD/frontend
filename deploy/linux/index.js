const Koa = require('koa')
const Router = require('koa-router')
const body = require('koa-body') // 用来解析post参数
const shell = require('shelljs')

const app = new Koa()
const router = new Router()

// function run_cmd(cmd, args, callback) {
//     var spawn = require('child_process').spawn;
//     var child = spawn(cmd, args);
//     var resp = '';
//     var endTip = `${args[1]}部署完成, runing on port ${args[2]}`;
//     child.stdout.on('data', function (buffer) { resp += buffer.toString(); });
//     child.stdout.on('end', function () { callback(resp + ' ' + endTip) });
// }

function deploy(){
    shell.echo("执行shell脚本！")
    shell.exec("sh deploy.sh")
}

app.use(body());

// 一个捕捉错误的中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err);
        ctx.throw(500)
    }
})
// post
router.post('/dockerDeploy', async ctx => {
    const header = ctx.request.header
    // 参数就是payload
    const body = ctx.request.body
    // 事件
    const event = header['x-github-event']

    // 分支
    const ref = JSON.parse(body.payload).ref

    console.log("ref: ", JSON.parse(body.payload).ref, "event: ", event)
    
    ctx.body = 'ok';
    // 仅在 push dev支时处理
    if (ref === 'refs/heads/dev' && event === 'push') {
        // 运行
        console.log("run_cmd!")
        // run_cmd('sh', ['./deploy.sh','lesschat-frontend', '3000'], function (text) { console.log(text) })
        deploy()
    }
})


app.use(router.routes()).use(router.allowedMethods());

app.listen(2048, () => {
    console.log('listening on 2048 success!')
})
