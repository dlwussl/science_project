const express = require('express');
const router = express.Router();
const mainMid = require('./mainController.js')

router.get('/',mainMid.mainGetMid)

module.exports = router