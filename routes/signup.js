const express = require('express');
const router = express.Router();

router.get('/signup', function (req, res) {
	res.render('signup')
});

module.exports = router;