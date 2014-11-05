var zetta = require('zetta');
var Twilio = require('zetta-twilio-driver');
var Spreadsheet = require('zetta-spreadsheet-google-driver');
var LED = require('zetta-led-edison-driver');
var Buzzer = require('zetta-buzzer-edison-driver');
var Microphone = require('zetta-microphone-edison-driver');
var Hue = require('zetta-hue-driver');
var Camera = require('zetta-jsmpeg-camera');
var Security = require('./devices/security');
var RecordIntrusions = require('./apps/record');


var twilioOpts = {
  phoneNumber: '+17342452497'
};

zetta()
  .name('matt.dobson')
  .use(Twilio, twilioOpts)
  .use(Spreadsheet, 'Intrusions-Demo', 'Sheet1')
  .use(LED)
  .use(Buzzer)
  .use(Microphone)
  .use(Hue)
  .use(Camera)
  .use(Security)
  .use(RecordIntrusions)
  .link('http://zetta-instructor.herokuapp.com/')
  .listen(1337);
