/**
 * @class CopyFromS3
 * @classdesc CopyFromS3 is a generic script to copy specified file from S3 to disk.  This script is intended to copy
 * large files to S3 in a separate thread where the file size may run a risk of overwhelming the calling
 * service.
 *
 * CopyFromS3 is evented and emits the following events:
 *  - progress : a message fired at each step; file stat, read, and copy
 *  - complete : fired when the copy has been completed
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2016-09-08
 */
const events = require('events' ),
    util = require('util' ),
    crypto = require('crypto' ),
    mime = require('mime-types');

const CopyFromS3 = function(options) {
    'use strict';

    const copier = this,
        fs = options.fs || require('fs'),
        log = options.log,
        bucket = options.bucket,
        s3 = options.s3,
        destFile = options.destFile,
        key = options.key;

    let stats = {};
    let callback = null;
    
    this.copyCompleteCallback = function(err, response) {
        stats.endTime = Date.now();
        stats.elapsedTime = status.endTime - stats.startTime;

        if (!err) {

        }
    };

    this.copy = function(completeCallback) {
        callback = completeCallback;

        stats = {
            message:'read S3 object: ' + key,
            startTime:Date.now(),
            destFile:destFile
        };

        log.info( stats.message );

        copier.emit('progress', stats);
    };

    // constructor validations
    if (!log) throw new Error('copier must be constructed with a log');
    if (!bucket) throw new Error('copier must be constructed with a bucket name');
    if (!s3) throw new Error('copier must be constructed with an S3 object');
    if (!destFile) throw new Error('copier must be constructed with a destination file name');
    if (!key) throw new Error('copier must be constructed with a target key');

    events.EventEmitter.call( this );
};

util.inherits( CopyFromS3, events.EventEmitter );

module.exports = CopyFromS3;