var Scout = require('zetta').Scout;
var util = require('util');
var Security = require('./security_driver');

var SecurityScout = module.exports = function() {
  Scout.call(this);
};
util.inherits(SecurityScout, Scout);

SecurityScout.prototype.init = function(next) {
  var self = this;
  //var hueQuery = this.server.where({ type: 'huehub' });
  var buzzerQuery = this.server.where({ type: 'buzzer' });
  var microphoneQuery = this.server.where({ type: 'microphone' });
  var emailQuery = this.server.where({ type: 'email' });
  var beanQuery = this.server.where({ type: 'bean' });

  //var queries = [ hueQuery, buzzerQuery, microphoneQuery, emailQuery ];
  var queries = [buzzerQuery, microphoneQuery, emailQuery, beanQuery];
  this.server.observe(queries, function(buzzer, microphone, email, bean) {
    var securityQuery = self.server.where({ type: 'security-system' });
    var args = Array.prototype.slice.call(arguments);
    args.unshift(Security);
    self.server.find(securityQuery, function(err, results) {
      if(results.length) {
        var securitySystem = results[0];
        args.unshift(securitySystem);
        self.provision.apply(self, args);
      } else {
        self.discover.apply(self, args);
      } 
    });
  });
  next();
};
