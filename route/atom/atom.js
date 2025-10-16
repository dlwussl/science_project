const express = require('express');
const router = express.Router();
const atomMid = require('./atomController')
router.post('/make',atomMid.makeAtom)

module.exports = router;