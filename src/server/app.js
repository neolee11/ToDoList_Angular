/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var logger = require('morgan');
var port = process.env.PORT || 7203;

var environment =  process.env.NODE_ENV; //'DEV'; //need to change

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use(errorHandler.init);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

var source = '';

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

switch (environment){
    //case 'production':
    //    console.log('** PRODUCTION ON AZURE **');
    //    console.log('serving from ' + './build/');
    //    process.chdir('./../../');
    //    app.use('/', express.static('./build/'));
    //    break;
    //case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');

        //console.log('serving from ' + './src/client/ and ./');
        //app.use('/', express.static('./src/client/'));
        //app.use('/', express.static('./'));

        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});
