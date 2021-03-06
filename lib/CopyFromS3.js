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
    util = require('util' );

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
    
    this.copyCompleteCallback = function(err) {
        stats.endTime = Date.now();
        stats.elapsedTime = stats.endTime - stats.startTime;

        log.info('copy complete, elapsed time:', stats.elapsedTime);
        copier.emit('complete', stats);

        if (typeof callback === 'function') {
            setImmediate(() => {
                callback( err, stats );
                callback = null;
            });
        }
    };

    this.writeObjectToDisk = function(err, response) {
        if (err) {
            log.error("copy failed: ", err.message);
            stats.error = err.message;

            copier.emit('error', stats);
            copier.copyCompleteCallback( err );
        } else {
            fs.writeFile( destFile, response.Body, copier.copyCompleteCallback );
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

        const params = {
            Bucket:bucket,
            Key:key
        };

        if (destFile) {
            log.info('write the file: ', destFile);
            s3.getObject( params, copier.writeObjectToDisk );
        } else {
            s3.getObject( params, (err, response) => {
                if (err) {
                    log.error( err );
                } else {
                    stats.body = response.Body;
                }

                copier.copyCompleteCallback( err );
            });
        }
    };

    // constructor validations
    if (!log) throw new Error('copier must be constructed with a log');
    if (!bucket) throw new Error('copier must be constructed with a bucket name');
    if (!s3) throw new Error('copier must be constructed with an S3 object');
    if (!key) throw new Error('copier must be constructed with a target key');

    events.EventEmitter.call( this );
};

util.inherits( CopyFromS3, events.EventEmitter );

module.exports = CopyFromS3;
