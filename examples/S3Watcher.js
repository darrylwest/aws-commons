#!/usr/bin/env node
/**
 * @class S3Watcher
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/28/14 11:28 AM
 */
var VERSION = '0.1.1',
    path = require('path'),
    dash = require('lodash' ),
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
        factory,
        watcher,
        options,
        referenceList;

    options = parser
        .version( VERSION )
        .option('-b --bucket <bucket>', 'set the bucket name (required)')
        .option('-i --interval [interval]', 'set the idle/loop time', 5000)
        .option('-a --accessFile <accessFile>', 'set the access file')
        .parse( process.argv );

    log.info('version: ', VERSION, ' sleep interval: ', options.interval);

    if (options.accessFile) {
        log.info('set the access file: ', options.accessFile);
        opts.keyfile = options.accessFile;
    }

    factory = AWSCommonsFactory.createInstance( opts );

    this.run = function() {
        var opts;

        if (!options.bucket) {
            parser.outputHelp();
            log.error('bucket name is required...');
            return;
        }

        opts = {
            log:log,
            s3:factory.createS3Connection(),
            bucket:options.bucket,
            sleepInterval:dash.parseInt( options.interval )
        };

        watcher = new S3BucketWatch( opts );

        watcher.on('listAvailable', function(size) {
            if (!referenceList) {
                referenceList = watcher.getContentList();

                log.info('reference list size: ', dash.size( referenceList ));
            } else if (size !== dash.size( referenceList )) {
                log.info('list size changed: ', dash.size( referenceList ), ' is now ', size);

                referenceList = watcher.getContentList();
            }
        });

        // set listeners...
        watcher.on('change', function(item, action) {
            log.info( item.key, ' was ', action);

            log.info( item );
        });

        watcher.on('error', function(err) {
            log.error( err );
        });

        watcher.start();
    };
};

new S3Watcher().run();
