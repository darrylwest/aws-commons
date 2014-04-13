#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    log = require('simple-node-logger').createLogger(),
    home = process.env.HOME,
    keyfile = path.join(home, '.settings/profmed.keys.enc'),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var listBucketsCallback = function(err, data) {
    if (err) log.error( err );

    log.info( data );
};

fs.readFile(keyfile, 'utf8', function(err, data) {
    var b64keys = data;

    var json = new Buffer(b64keys, 'base64').toString('ascii');

    log.info( JSON.parse( json ));

    var opts = {
        base64Keys:b64keys,
        log:log
    };

    var factory = AWSCommonsFactory.newInstance( opts );

    var s3 = factory.createS3Connection();

    log.info( s3 );

    s3.listBuckets( listBucketsCallback );
});

