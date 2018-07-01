const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('./config')
const api = require('./api')
const pkg = require('./package')
const winston = require('winston')
const expressWinston = require('express-winston')

const app = express()

// 设置跨域访问
app.all('*', (req, res, next) => {
	// 允许访问的域
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Header', 'X-Request-With')
	// 允许的header类型
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	res.header('X-Powered-By', '3.2.1')
	res.header('Content-Type', 'application/json;charset=utf-8')
	next()
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
	name: config.dev.session.key,
	secret: config.dev.session.secret,
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: config.dev.session.maxAge
	},
	store: new MongoStore({
		url: config.dev.mongodb
	})
}))

app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'static/img'),
	keepExtensions: true
}))

app.locals.blog = {
	title: pkg.name,
	description: pkg.description
}

app.use((req, res, next) => {
	res.locals.user = req.session.user
	next()
})

app.use(expressWinston.logger({
	transports: [
		new winston.transports.File({
			filename: 'logs/success.log'
		})
	]
}))
api(app)
app.use(expressWinston.errorLogger({
	transports: [
		new winston.transports.File({
			filename: 'logs/error.log'
		})
	]
}))

app.use((err, req, res, next) => {
	console.error(err)
	res.redirect('/posts')
})

if (module.parent) {
	module.exports = app
} else {
	app.listen(config.dev.serverPort, () => {
		console.log(`${pkg.name} listening on http://localhost:${config.dev.serverPort}`)
	})
}
