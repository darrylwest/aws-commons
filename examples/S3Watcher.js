#!/usr/bin/env node
/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 4/28/14 11:28 AM
 */
var VERSION = '0.1.1',
    path = require('path'),
    parser = require('commander' ),
    S3BucketWatch = require('../lib/S3BucketWatch' ),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var S3Watcher = function() {
    'use strict';

    var s3watcher = this,
        log = require('simple-node-logger' ).createSimpleLogger(),
        opts = {
            log:log,
            keyfile:path.join( __dirname, 'keys.enc' )
        },
        factory = AWSCommonsFactory.createInstance( opts ),
        watcher,
        options;

    options = parser
        .version( VERSION )
        .option('-b --bucket <bucket>', 'set the bucket name (required)')
        .parse( process.argv );

    log.info('version: ', VERSION);

    this.run = function() {
        if (!options.bucket) {
            parser.outputHelp();
            log.error('bucket name is required...');
            return;
        }

        var opts = {
            log:log,
            s3:factory.createS3Connection(),
            bucket:options.bucket
        };

        watcher = new S3BucketWatch( opts );

        // set listeners...

        watcher.start();
    };
};

new S3Watcher().run();
