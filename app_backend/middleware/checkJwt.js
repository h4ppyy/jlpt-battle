const jwt = require('jsonwebtoken');
const common = require('../controllers/common.js');
const secret = require('../config/config.js').secret;


module.exports = function (req, res, next) {
  var now = Math.floor(Date.now() / 1000);
  var token = req.headers.authorization;
  common.logging_debug('token', token);
  common.logging_debug('req.headers', req.headers);


  if(token){
      jwt.verify(token, secret, function(err, decoded) {
          if(err == null){
              common.logging_debug('decoded.exp', decoded.exp);
              common.logging_debug('now', now);
              common.logging_debug('decoded.exp > now', decoded.exp > now);
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
  } else {
      res.status(403).json({"result": 403})
  }

};
