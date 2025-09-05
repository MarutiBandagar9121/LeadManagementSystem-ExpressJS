const express = require('express');
const router = express.Router();

const testController = require('../controller/testController');

router.get('/hello',testController.hello);

module.exports = router;