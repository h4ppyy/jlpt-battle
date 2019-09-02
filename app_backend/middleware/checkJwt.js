const jwt = require('jsonwebtoken');
const common = require('../controllers/common.js');


module.exports = function (req, res, next) {
  var now = Math.floor(Date.now() / 1000);
  var secretKey = 'secret';
  var token = req.headers.authorization;

  console.log('req.headers -> ', req.headers);
  console.log('token -> ', token);
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaXNfc3RhZmYiOjAsImV4cCI6MTU2NzUxNjkzMCwiaWF0IjoxNTY3NDMwNTMwfQ.s5DWvUhWvb-1ob4_yVfiaHbBiF6shoVEyrmxgiKuqmI'
  
  jwt.verify(token, secretKey, function(err, decoded) {
      if(err == null){
          if(decoded.exp > now){
              req.decoded = decoded;
              next();
          } else {
              res.status(403).json({"result": 403})
          }

      } else {
          res.json({"result": 500})
      }
  });
};
