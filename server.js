var zetta = require('zetta');
var Twilio = require('zetta-twilio-driver');
var Spreadsheet = require('zetta-spreadsheet-google-driver');
var LED = require('zetta-bonescript-led-driver');
var Buzzer = require('zetta-bonescript-buzzer-driver');
var Microphone = require('zetta-bonescripte-microphone-driver');
var Hue = require('zetta-hue-driver');
var Camera = require('zetta-jsmpeg-camera');
var Security = require('./devices/security');
var RecordIntrusions = require('./apps/record');


var twilioOpts = {
  phoneNumber: '+17346345472'
};

zetta()
  .name('matt.dobson')
  .use(Twilio, twilioOpts)
  .use(Spreadsheet)
  .use(LED)
  .use(Buzzer)
  .use(Microphone)
  .use(Hue)
  .use(Camera)
  .use(Security)
  .use(RecordIntrusions);
  .link('http://hello-zetta.herokuapp.com/')
  .listen(1337);
