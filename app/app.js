
/**
 * Module dependencies.
 */

const express = require('express')
const app = express()
const path = require('path')
const history = require('connect-history-api-fallback')
// const connect = require('connect')
// const favicon = require('serve-favicon');
const bodyParser = require('body-parser')
const timeout = require('connect-timeout')
const proxy = require('http-proxy-middleware')

// const routes = require('./routes/user')

// app.use('/user', require('./routes/user'))



/* app.set('trust proxy', function (ip) {
  console.log(ip);
  if (ip === '127.0.0.1' || ip === '192.168.1.136') return true; // 受信的 IP 地址
  else return false;
}) */

// set favicon.ico
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('dist'));
app.set('views', './dist') // 指定视图所在的位置

/**
 * 将ejs替换为html格式
 */
// 方法1 这种方式需要render的时候，文件名要带上.html后缀名
// app.set('view engine', 'ejs') // 注册模板引擎
// app.engine('html', require('ejs').renderFile)

// 方法2 这种方法比较简洁
app.set('view engine', 'html') 
app.engine('.html', require('ejs').__express)

// for parsing application/json
app.use(bodyParser.json());

// app.use(history())

/* app.get('/go', function(req, res) {
  console.log(req.originalUrl);
  res.redirect('//m.lkker.com' + req.originalUrl)
}) */

app.get('*', function (req, res) {
  res.render('index', { title: '洛客' })
})

// app.get('/login', function(req, res) {
//   res.render('index', { title: '登录' })
// })
//
// var jsonPlaceholderProxy = proxy({
//   target: 'http://www.lkker.com',
//   changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
//   logLevel: 'debug'
// })
//
// app.use('/opusList', jsonPlaceholderProxy)
// app.use('/opus', jsonPlaceholderProxy)
// app.use('/images', jsonPlaceholderProxy)
//
// app.get('/user', function (req, res) {
//   res.send('it\'s user page')
// })
//
// app.post('/add', function(req, res) {
//   console.log('req.body=>' + JSON.stringify(req.body))
//   console.log('req.param=>' + JSON.stringify(req.param))
//   var account = req.param('account');
//   var password = req.param('password');
//   console.log('account:' + account + ';password:' + password);
//   res.json({ msg: 'success!'})
// })
//
// // 404 跳转现有项目中
// app.use(function(req, res, next) {
//   var reqUrl = req.originalUrl
//   console.log('404 => ' + reqUrl);
//   res.redirect('/');
// });

// 5xx
// TODO 记录错误日志 http://www.expressjs.com.cn/guide/error-handling.html
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('请确认是否运行了npm run build');
});


app.listen(8866, function () {
  console.log(' express is started at port 8866 \n click the address http://localhost:8866 to visited!')
})
