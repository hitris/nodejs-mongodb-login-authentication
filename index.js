var express = require('express'),
	mongodb = require('mongodb'),
	pug = require('pug'),
	bodyParser = require('body-parser'),
	cookieSession = require('cookie-session');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
var app = express();

const indexRouter = require('./routes/index');
const test = require('./routes/test');
const login = require('./routes/login');
const signup = require('./routes/signup');

app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2'],
	maxAge: 24 * 60 * 60 * 1000
}));

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});

// app.use(express.static('public'));

app.set('view engine', 'pug');

//身份验证中间件
app.use(function (req, res, next) {
	if (req.session.loggedIn) {
		res.locals.authenticate = true;
		app.users.findOne({'_id': ObjectID(req.session.loggedIn)}, function (err, doc) {
			if (err) return next(err);
			res.locals.me = doc;
			next();
		})
	} else {
		res.locals.authenticate = false;
		next();
	}
});

app.use(indexRouter);
app.use(test);
app.use(login);
app.use(signup);


app.get('/login/:signupEmail', function (req, res) {
	res.render('login', {signupEmail: req.params.signupEmail})
});

app.post('/signup', urlencodedParser, function (req, res, next) {
	app.users.insertOne(req.body, function (err, doc) {
		if (err) return next(err);
		console.log(doc);
		res.redirect('/login/' + doc.ops[0].email)
	})
});

app.post('/login', urlencodedParser, function (req, res) {
	app.users.findOne({email: req.body.email, password: req.body.password}, function (err, doc) {
		if (err) return next(err);
		if (!doc) return res.send('<p>User not found or password wrong. Go back and try again</p>');
		req.session.loggedIn = doc._id.toString();
		res.redirect('/');
	})
});

app.get('/logout', function (req, res) {
	req.session.loggedIn = null;
	res.redirect('/');
});


MongoClient.connect('mongodb://localhost:27017', function (err, client) {
	if (err) throw err;
	console.log('\033[96m + \033[39m connected to mongodb');
	const adminDb = client.db('my-website');
	app.users = adminDb.collection('users');
	//创建数据库索引
	app.users.createIndexes([{key: {email: 1}, name: 'email'}, {
		key: {password: 1},
		name: 'password'
	}], function (err, result) {
		if (err) throw err;
	});
	// client.ensureIndex('users','email',function (err) {
	// 	if(err) throw err;
	// 	client.ensureIndex('users','password',function (err) {
	// 		if(err) throw err;
	// 		console.log('\033[96m + \033[39m ensured indexeds');
	// 	});
	// });

	app.listen(3000, function () {
		console.log('\033[96m + \033[39m listening on 127.0.0.1:3000');
	});
});