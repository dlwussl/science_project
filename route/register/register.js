const express = require('express');
const router = express.Router();
const registerMid = require('./registerController.js')

router.get('/register',registerMid.registerGetMid);
router.post('/register',registerMid.registerPostMid);

module.exports = router