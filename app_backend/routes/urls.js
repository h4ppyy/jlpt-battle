const express = require('express');
const router = express.Router();


const createUserController = require('../controllers/createUser')
const getChatLogController = require('../controllers/getChatLog')
const getCurrentKanjiController = require('../controllers/getCurrentKanji')
const getHistoryLogController = require('../controllers/getHistoryLog')
const loginUserController = require('../controllers/loginUser')
const sendHiraganaController = require('../controllers/sendHiragana')
const testController = require('../controllers/test')


router.post('/api/createUser', createUserController.createUser)
router.post('/api/loginUser', loginUserController.loginUser)
router.post('/api/getChatLog', getChatLogController.getChatLog)
router.post('/api/getCurrentKanji', getCurrentKanjiController.getCurrentKanji)
router.post('/api/getHistoryLog', getHistoryLogController.getHistoryLog)
router.post('/api/sendHiragana', sendHiraganaController.sendHiragana)
router.get('/test', testController.test)


module.exports = router;
