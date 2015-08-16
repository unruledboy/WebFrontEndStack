var express = require('express');
var path = require('path');
var app = new express();
app
    .set('port', process.env.PORT || 3000)
    .set('view engine', 'html')
    .use(express.static(path.join(__dirname, '/ux')))
    .use('/', function(req, res) {
    	res.redirect('/WebFrontEndStack.html');
    })
    .listen(app.get('port'), function () {
        console.info('Express started on: http://127.0.0.1:' + app.get('port'));
    });
