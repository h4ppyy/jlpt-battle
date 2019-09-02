const express = require('express');
const router = express.Router();


// 미들웨어 관리
const checkJwt = require('../middleware/checkJwt.js');


// 컨트롤러 관리
const createUserController = require('../controllers/createUser')
const getChatLogController = require('../controllers/getChatLog')
const getCurrentKanjiController = require('../controllers/getCurrentKanji')
const getHistoryLogController = require('../controllers/getHistoryLog')
const loginUserController = require('../controllers/loginUser')
const sendHiraganaController = require('../controllers/sendHiragana')
const testController = require('../controllers/test')


// 라우터 관리
router.post('/api/createUser', createUserController.createUser)
router.post('/api/loginUser', loginUserController.loginUser)
router.post('/api/getChatLog', getChatLogController.getChatLog)
router.post('/api/getCurrentKanji', getCurrentKanjiController.getCurrentKanji)
router.post('/api/getHistoryLog', getHistoryLogController.getHistoryLog)
router.post('/api/sendHiragana', sendHiraganaController.sendHiragana)
router.post('/test', checkJwt, testController.test)


module.exports = router;
