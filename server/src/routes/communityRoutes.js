const express = require('express');
const { createCommunity, listCommunities, deleteCommunity, getCommunityByName } = require('../controllers/communityController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createCommunity);
router.get('/', auth, listCommunities);
router.get('/:name', auth, getCommunityByName);
router.delete('/:id', auth, deleteCommunity);

module.exports = router;
