const express = require('express');
const app = express();

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/currencies', function(req, res){
    var currencies = require('./currencies');
  	res.send(currencies);
});


var port = 8000;
app.listen(port, function() {
  console.log('server listening on port ' + port);
});