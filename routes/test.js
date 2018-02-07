const express = require('express');
const router = express.Router();

router.get('/test', function (req, res) {
	res.render('test', {title: 'hey', message: 'Im the test page!'})
});

module.exports = router;