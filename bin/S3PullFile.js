#!/usr/bin/env node

// dpw@seattle.local
// 2016.09.05

/**
 * @class S3PullFile
 * @classdesc A simple script to copy a specified file from disk to a specified S3 bucket / key location.
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2016-09-05
 */
const VERSION = '0.1.11',
    path = require('path'),
    parser = require('commander' ),
    CopyFromS3 = require('../lib/CopyFromS3' ),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

const S3PullFile = function() {
    'use strict';

    const copy = this,
        log = require('simple-node-logger' ).createSimpleLogger(),
        home = process.env.HOME,
        opts = {
            log:log,
            keyfile:path.join( home, '.ssh', 'keys.enc' )
        };

    let factory,
        copier,
        options;

    options = parser
        .version( VERSION )
        .option('-f --file <file>', 'set the destination file')
        .option('-b --bucket <bucket>', 'set the source bucket')
        .option('-k --key <key>', 'set the file key, e.g., source name')
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
        const errors = copy.validateOptions();

        if (errors.length > 0) {
            parser.outputHelp();
            log.error( errors.join('\n') );
            return;
        }

        const opts = {
            log:log,
            destFile:options.file,
            bucket:options.bucket,
            key:options.key,
            s3:factory.createS3Connection()
        };

        if (options.private) {
            log.info('set the acl to private');
            opts.acl = 'private';
        }

        copier = new CopyFromS3( opts );
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
    };
};

new S3PullFile().run();
