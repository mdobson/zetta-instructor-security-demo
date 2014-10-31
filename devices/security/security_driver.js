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

  this._listener = function(data) {
    if(data.data > 10) {
      self.call('start-alarm');
    }
  };

  this._stream = self._microphone.streams.volume;
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
  this._stream.on('data', this._listener);
  this.state = 'armed';
  cb();
};

SecuritySystem.prototype.disarmSystem = function(cb) {
  this._stream.removeListener('data', this._listener);
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
  async.series([
    function(callback) {
      self._buzzer.call('turn-on', function(err) {
        callback(err);
      })
    },
    function(callback) {
      self._huehub.call('color', '#ff0000', function(err) {
        callback(err);
      });
    },
    function(callback) {
      self._phone.call('send-sms', '+17346345472', 'Alert! Someone has tripped your alarm!', function(err) {
        callback(err);
      });
    }
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
  async.series([
    function(callback) {
      self._buzzer.call('turn-off', function(err) {
        callback(err);
      })
    },
    function(callback) {
      self._huehub.call('color', '#0000ff', function(err) {
        callback(err);
      });
    }
  ], function(err, results) {
    if(err) {
      cb(err);
    } else {
      cb();
    }
    self.state = 'disarmed';
  });
};
