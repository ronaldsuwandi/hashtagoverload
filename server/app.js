var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var _ = require('lodash');
var apiKey = require('../apiKey').key;


// express app
var app = express();
var server = http.createServer(app);

// configure server
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use(express.favicon());

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.errorHandler({ dumpException: true, showStack: true}));
});

// Start server
server.listen(3000, function() {
  console.log('Express server listening on port %d in %s mode',
    server.address().port, app.settings.env);
});

app.get('/api/:word', function(req,res) {
  getSynonyms(req.params.word, res);
});

app.get('/about', function (req,res) {
	res.sendfile(path.join(__dirname, '..', 'public', 'about', 'about.html'));
});

var apiUrl = 'http://words.bighugelabs.com/api/2/' + apiKey + '/';

function getSynonyms(word, res) {
  request(apiUrl+word+'/json', function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);

      var result = json[Object.keys(json)[0]];
      var resultWords = [];

      if (result) {
        if(result.sim) {
          resultWords.push(result.sim);
        }

        if(result.syn) {
          resultWords.push(result.syn);
        }

        if(result.ant) {
          resultWords.push(result.ant);
        }

        resultWords = _.flatten(resultWords);
      };

      // limit 6 answers
      return res.send(_.first(resultWords, 6));
    } else {
      return res.send(body);
    }
  });
}

// location-based (wwdc conference)
// freinds
