/*
공통 모듈 사용 방법

const common = require('./common.js');

var x = common.getRandom(5);
*/

module.exports = {
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
};
