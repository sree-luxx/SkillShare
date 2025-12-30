const express = require('express');
const { getAllUsers, getPeers } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getAllUsers);
router.get('/peers', auth, getPeers);

module.exports = router;
