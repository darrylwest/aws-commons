#!/usr/bin/env node

var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    filename = path.join( __dirname, 'keys.enc');

var keys = {
      "version":"2.0",
      "aws":{
        "accessKeyId":"<your-access-key",
        "secretAccessKey":"<your-secret-access-key"
      },
      "ses":{
        "accessKey":"<your-access-key",
        "secretKey":"<your-secret-key"
      }
    };

var enc = new Buffer( util.format('%j', keys) ).toString('base64') ;

fs.writeFile( filename, enc, function(err) {
    if (err) throw err;
    console.log( 'new file: ', filename );
});

