#!/usr/bin/env node
/**
 * @class S3Lister
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/27/14 4:54 PM
 */
var VERSION = '0.1.4',
    path = require('path'),
    parser = require('commander'),
    S3ObjectList = require('../lib/S3ObjectList'),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var S3Lister = function() {
    'use strict';

    var s3lister = this,
        log = require('simple-node-logger' ).createSimpleLogger(),
        home = process.env.HOME,
        opts = {
            log:log,
            keyfile:path.join( home, '.ssh', 'keys.enc' )
        },
        factory,
        lister,
        options,
        config;

    options = parser
        .version( VERSION )
        .option('-b --bucket <bucket>', 'set the bucket to list (required)')
        .option('-p --prefix <prefix>', 'set the optional prefix')
        .option('-a --accessFile <accessFile>', 'set the access file')
        .option('-v --verbose', 'verbose listing')
        .parse( process.argv );

    log.info('version: ', VERSION);

    if (options.accessFile) {
        log.info('set the access file: ', options.accessFile);
        opts.keyfile = options.accessFile;
    }

    factory = AWSCommonsFactory.createInstance( opts );

    this.run = function() {
        // verify the reqired command line parameters
        var errors = s3lister.validateOptions();

        if (errors.length > 0) {
            parser.outputHelp();
            log.error( errors.join('\n') );
            return;
        }

        var opts = {
            log:log,
            s3:factory.createS3Connection(),
            bucket:options.bucket
        };

        if (options.prefix) opts.prefix = options.prefix;

        lister = new S3ObjectList( opts );
        lister.on('complete', function(results) {
            results.list.forEach(function(item) {
                if (options.verbose) {
                    log.info( item.key, ' ', item.size, ' ', item.lastModified );
                } else {
                    log.info( item.key );
                }
            });
        });

        lister.on('error', function(err) {
            log.error( err.message );
        });

        lister.list();
    };

    this.validateOptions = function() {
        var errors = [];

        if (!options.bucket) errors.push('request must include a destination bucket');

        return errors;
    }
};

new S3Lister().run();
