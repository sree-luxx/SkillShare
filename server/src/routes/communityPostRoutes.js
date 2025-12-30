const express = require('express');
const auth = require('../middleware/auth');
const { listByCommunity, create, react, addComment } = require('../controllers/communityPostController');
const router = express.Router();

router.get('/:name', auth, listByCommunity);
router.post('/', auth, create);
router.put('/:id/react', auth, react);
router.post('/:id/comments', auth, addComment);

module.exports = router;
