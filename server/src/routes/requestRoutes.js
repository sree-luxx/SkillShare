const express = require('express');
const { 
  sendRequest, 
  getRequestsMade, 
  withdrawRequest,
  getRequestsReceived,
  updateRequestStatus 
} = require('../controllers/requestController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, sendRequest);
router.get('/made', auth, getRequestsMade);
router.get('/received', auth, getRequestsReceived);
router.put('/:id/status', auth, updateRequestStatus);
router.delete('/:id', auth, withdrawRequest);

module.exports = router;
