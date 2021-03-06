const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Twitter = require('twit');
const app = express();

/* Middlewares */
app.set('view engine', 'pug');
app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

/* Routes */
app.get('/', function (req, res) {
	if (req.query.code) {
		res.render('status', {code: req.query.code, tweetId: req.query.id})
	}
	else {
		res.render('confessional');
	}
});

app.post('/api/publish', function (req, res) {
	const body = req.body;

	if (body.turing != '') {
		res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Bot Rick'roll
	}
	else {
		const iConfess = new Twitter({
			consumer_key: process.env.app_key,
			consumer_secret: process.env.app_secret,
			access_token: process.env.admin_key,
			access_token_secret: process.env.admin_secret
		});

		iConfess.post('statuses/update', {status: body.confession}, function(err, tweet, response) {
			if(err) {
				res.redirect('/?code='+err[0].code);
			}
			else {
				const id = tweet.id_str;
				res.redirect('/?code=200&id='+id);
			}
		});
	}
});

/* 3, 2, 1, Launch ! */
app.listen(process.env.PORT || 3000, function() {
});