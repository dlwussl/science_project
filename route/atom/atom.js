const express = require('express');
const router = express.Router();
const atomMid = require('./atomController')
router.post('/make',atomMid.makeAtom)
router.get('/atom',atomMid.getAtom)

module.exports = router;