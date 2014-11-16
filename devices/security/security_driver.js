var Device = require('zetta').Device;
var util = require('util');
var async = require('async');

var SecuritySystem = module.exports = function(){
  Device.call(this);
  var args = Array.prototype.slice.call(arguments);
  var self = this;
  args.forEach(function(device) {
    self['_'+device.type] = device;
  });

  this._soundListener = function(data) {
    if(data.data > 10) {
      self.call('start-alarm');
    }
  };

  this._motionListener = function(data) {
    if(data.data > 1.2) {
      self.call('start-alarm');
    }
  };

  this._soundStream = self._microphone.streams.volume;
  this._motionStream = self._bean.streams.accerationY;
};
util.inherits(SecuritySystem, Device);

SecuritySystem.prototype.init = function(config) {
  config
    .type('security-system')
    .name('Security System')
    .state('disarmed')
    .when('disarmed', { allow:['arm-system'] })
    .when('armed', { allow:['disarm-system', 'start-alarm']})
    .when('alarm', { allow: ['disarm-system', 'stop-alarm']})
    .map('arm-system', this.armSystem)
    .map('disarm-system', this.disarmSystem)
    .map('start-alarm', this.startAlarm)
    .map('stop-alarm', this.stopAlarm);
};

SecuritySystem.prototype.armSystem = function(cb) {
  this._soundStream.on('data', this._soundListener);
  this._motionStream.on('data', this._motionListener);
  this.state = 'armed';
  cb();
};

SecuritySystem.prototype.disarmSystem = function(cb) {
  this._soundStream.removeListener('data', this._soundListener);
  this._motionStream.removeListener('data', this._motionListener);
  this.state = 'disarmed';
  if(this._buzzer.state === 'on') {
    this._buzzer.call('turn-off', function(err) {
      if(err) {
        cb(err);
      } else {
        cb();
      }
    });	
  } else {
    cb();
  }
};

SecuritySystem.prototype.startAlarm = function(cb) {
  var self = this;
  
  function turnOnBuzzer(callback) {
    self._buzzer.call('turn-on', function(err) {
      callback(err);
    })
  }

  function turnOnHue(callback) {
    self._huehub.call('color', '#ff0000', function(err) {
      callback(err);
    });
  }

  function sendMail(callback) {
    self._email.call('send-mail', 'mdobson4@gmail.com', 'mdobson@apigee.com', 'Security Alert', 'Alert! Someone has tripped your alarm!', function(err) {
      callback(err);
    });
  }
  async.series([
    turnOnBuzzer,
    sendMail
  ], function(err, results) {
    console.log('Final function');
    console.log(arguments);
    if(err) {
      cb(err);
    } else {
      cb();
    }
    self.state = 'alarm';
  });
};

SecuritySystem.prototype.stopAlarm = function(cb) {
  var self = this;
  function turnOffBuzzer(callback) {
    self._buzzer.call('turn-off', function(err) {
      callback(err);
    })
  }

  function turnOnHue(callback) {
    self._huehub.call('color', '#0000ff', function(err) {
      callback(err);
    });
  }
  async.series([
    turnOffBuzzer
  ], function(err, results) {
    if(err) {
      cb(err);
    } else {
      cb();
    }
    self.state = 'disarmed';
  });
};
