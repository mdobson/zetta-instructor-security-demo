var zetta = require('zetta');
var Spreadsheet = require('zetta-spreadsheet-google-driver');
var Email = require('zetta-gmail-driver');
var LED = require('zetta-led-bonescript-driver');
var Buzzer = require('zetta-buzzer-bonescript-driver');
var Microphone = require('zetta-microphone-bonescript-driver');
var Hue = require('zetta-hue-driver');
var Bean = require('zetta-bean-driver');
var Security = require('./devices/security');
var RecordIntrusions = require('./apps/record');

var credentials = {
  user: process.env.EMAIL,
  pass: process.env.PASSWORD
};

zetta()
  .name('matt.dobson')
  .use(Email, credentials)
  .use(Spreadsheet, 'Intrusions-Demo', 'Sheet1')
  .use(LED)
  .use(Buzzer)
  .use(Microphone)
  .use(Hue)
  .use(Bean, 'Nikola')
  .use(Security)
  .use(RecordIntrusions)
  .link('http://zetta-instructor.herokuapp.com/')
  .listen(1337);
