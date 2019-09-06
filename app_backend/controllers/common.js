const jwt = require('jsonwebtoken');
const logging = require('../config/config.js').logging;
const secret = require('../config/config.js').secret;


/*
공통 모듈 사용 방법
const common = require('./common.js');
var x = common.getRandom(5);
*/


module.exports = {
  CODE_SUCCESS: 200,                // 공통 - 로직 성공
  CODE_FAIL: 500,                   // 공통 - 로직 실패
  CODE_FOBIDDEN: 403,               // 공통 - 권한 없음
  CODE_ID_DUPLICATE: 300,           // 회원가입 - 아이디 중복
  CODE_ID_EMPTY: 301,               // 회원가입 - 아이디 공백
  CODE_ID_LENGTH_ERROR: 302,        // 회원가입 - 아이디 길이 조건 미충족
  CODE_PW_EMPTY: 303,               // 회원가입 - 비밀번호 공백
  CODE_PW_LENGTH_ERROR: 304,        // 회원가입 - 비밀번호 길이 조건 미충족
  CODE_PW_RE_EMPTY: 305,            // 회원가입 - 비밀번호 확인 공백
  CODE_PW_PWRE_NOT_SAME: 306,       // 회원가입 - 비밀번호와 비밀번호 확인 미일치
  CODE_JLPT_EMPTY: 307,             // 회원가입 - JLPT 레벨 공백
  CODE_ID_NOT_ALLOW: 308,           // 회원가입 - 아이디 허용 문자 외 입력
  CODE_PW_NOT_ALLOW: 309,           // 회원가입 - 비밀번호 허용 문자 외 입력
  CODE_ID_OR_PW_INCORRECT: 400,     // 로그인 - 아이디 또는 비밀번호 틀림
  CODE_PROBLEM_NULL: 700,           // 정답제출 - 문제가 존재하지 않음
  CODE_PROBLEM_FAIL: 701,           // 정답제출 - 오답 제출

  KANJI_NULL_TEXT: '출제된 문제 없음',  // 출제한자문구표기 - 데이터가 존재하지 않을 때
  KANJI_ERROR_TEXT: 'Error :(',     // 출제한자문구표기 - 로직 중 오류 발생 시

  SLOW_QUERY_SOLUTION: '100',       // 검색범위 - 100 일


  // 공통 함수
  getRandom: function (max) {
    return Math.floor((Math.random()*max)+1);
  },

  getDateTime: function () {
      var date = new Date();
      console.log('date -> ', date);
      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;
      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;
      var sec  = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;
      var day  = date.getDate();
      day = (day < 10 ? "0" : "") + day;
      return year + "-" + month + "-" + day + "-" + hour + ":" + min + ":" + sec;
  },

  getToken: function(id, username, staff) {
    var token = jwt.sign({
        'id': id,
        'username': username,
        'staff': staff,
        'exp': Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }, secret);
    return token;
  },

  givePoint: function(problem_level) {
    if (problem_level == 1){
        var point = 5
    } else if (problem_level == 2){
        var point = 4
    } else if (problem_level == 3){
        var point = 3
    } else if (problem_level == 4){
        var point = 2
    } else if (problem_level == 5){
        var point = 1
    }
    return point
  },

  logging_debug: function(key, val) {
    if(logging.debug == true) {
      console.log('DEBUG -> ' +key+ ' : ', val);
    }
  },

  logging_info: function(key, val) {
    if(logging.info == true) {
      console.log('INFO -> ' +key+ ' : ', val);
    }
  },

  logging_error: function(key, val) {
    if(logging.error == true) {
      console.log('ERROR -> ' +key+ ' : ', val);
    }
  }
};
