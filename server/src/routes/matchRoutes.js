const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

// Protected route to get AI matches
router.get('/', auth, matchController.getMatches);

module.exports = router;
