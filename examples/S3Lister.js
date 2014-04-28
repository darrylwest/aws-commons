#!/usr/bin/env node
/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 4/27/14 4:54 PM
 */
var VERSION = '0.1.1',
    path = require('path'),
    parser = require('commander'),
    S3ObjectList = require('../lib/S3ObjectList'),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var S3Lister = function() {
    'use strict';

    var s3lister = this,
        log = require('simple-node-logger' ).createLogger(),
        opts = {
            log:log,
            keyfile:path.join( __dirname, 'keys.enc' )
        },
        factory = AWSCommonsFactory.createInstance( opts ),
        lister,
        options,
        config;

    options = parser
        .version( VERSION )
        .option('-b --bucket <bucket>', 'set the bucket to list (required)')
        .option('-p --prefix <prefix>', 'set the optional prefix')
        .parse( process.argv );

    log.info('version: ', VERSION);

    this.run = function() {
        var opts = {
            log:log,
            s3:factory.createS3Connection(),
            bucket:options.bucket
        };

        if (options.prefix) opts.prefix = options.prefix;

        lister = new S3ObjectList( opts );
        lister.on('complete', function(results) {
            results.list.forEach(function(item) {
                log.info( item.key );
            });
        });

        lister.on('error', function(err) {
            log.error( err.message );
        });

        lister.list();
    };
};

new S3Lister().run();
