#!/usr/bin/env node

// This simple example lists all the bucket belonging to the key owner.  to run, you must create
// an encoded key object called 'keys.enc' in your $HOME/.settings folder.

var fs = require('fs'),
    path = require('path'),
    log = require('simple-node-logger').createLogger(),
    home = process.env.HOME,
    keyfile = path.join(home, '.settings/keys.enc'),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var listBucketsCallback = function(err, data) {
    if (err) log.error( err );

    log.info( data );
};

fs.readFile(keyfile, 'utf8', function(err, data) {
    var opts = {
        base64Keys:data,
        log:log
    };

    var factory = AWSCommonsFactory.newInstance( opts );

    var s3 = factory.createS3Connection();

    log.info( s3 );

    s3.listBuckets( listBucketsCallback );
});

