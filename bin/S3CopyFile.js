#!/usr/bin/env node
/**
 * @class S3CopyFile
 * @classdesc A simple script to copy a specified file from disk to a specified S3 bucket / key location.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 4/16/14 7:07 AM
 */
var VERSION = '0.1.3',
    path = require('path'),
    parser = require('commander' ),
    CopyToS3 = require('../lib/CopyToS3' ),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var S3CopyFile = function() {
    'use strict';

    var copy = this,
        log = require('simple-node-logger' ).createSimpleLogger(),
        home = process.env.HOME,
        opts = {
            log:log,
            keyfile:path.join( home, '.ssh', 'keys.enc' )
        },
        factory,
        copier,
        options;

    options = parser
        .version( VERSION )
        .option('-f --file <file>', 'set the source file')
        .option('-b --bucket <bucket>', 'set the destination bucket')
        .option('-k --key <key>', 'set the file key, e.g., destination name')
        .option('-a --accessFile <accessFile>', 'set the access file')
        .parse( process.argv );

    log.info('version: ', VERSION);

    if (options.accessFile) {
        log.info('set the access file: ', options.accessFile);
        opts.keyfile = options.accessFile;
    }

    factory = AWSCommonsFactory.createInstance( opts );

    this.run = function() {
        // verify the required command line parameters
        var errors = copy.validateOptions();

        if (errors.length > 0) {
            parser.outputHelp();
            log.error( errors.join('\n') );
            return;
        }

        var opts = {
            log:log,
            sourceFile:options.file,
            bucket:options.bucket,
            key:options.key,
            s3:factory.createS3Connection()
        };

        copier = new CopyToS3( opts );
        copier.on('complete', function() {
            log.info('copy complete...');
        });
        copier.on('error', function(err) {
            log.error( err.message );
        });

        copier.copy();
    };

    this.validateOptions = function() {
        var errors = [];

        if (!options.file) errors.push('request must include a source file');
        if (!options.bucket) errors.push('request must include a destination bucket');
        if (!options.key) errors.push('request must include a destination key');

        return errors;
    }
};

new S3CopyFile().run();
