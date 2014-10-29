module.exports = function(server) {
  var securityQuery = server.where({ type: 'security-system'});
  var spreadsheetQuery = server.where({ type: 'google`' });
  server.observe([securityQuery, spreadsheetQuery], function(securitySystem, spreadsheet){
    securitySystem.on('alarm', function() {
      spreadsheet.call('update', {1: 'An intrusion occured.', 2: new Date().toString() });
    });
  });
};
