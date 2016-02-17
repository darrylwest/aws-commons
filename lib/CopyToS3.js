/**
 * @class CopyToS3
 * @classdesc CopyToS3 is a generic script to copy specified file from disk to S3.  This script is intended to copy
 * large files to S3 in a separate thread where the file size may run a risk of overwhelming the calling
 * service.
 *
 * CopyToS3 is evented and emits the following events:
 *  - progress : a message fired at each step; file stat, read, and copy
 *  - complete : fired when the copy has been completed
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 7:57 PM
 */
const events = require('events' ),
    util = require('util' ),
    crypto = require('crypto' ),
    mime = require('mime-types');

/**
 * @param options - source file, target bucket/key, s3 instance
 * @constructor
 */
const CopyToS3 = function(options) {
    'use strict';

    const copier = this,
        fs = options.fs || require('fs'),
        log = options.log,
        bucket = options.bucket,
        s3 = options.s3,
        sourceFile = options.sourceFile,
        key = options.key,
        acl = options.acl || 'public-read';

    var stats = {};

    this.copyCompleteCallback = function(err, response) {
        stats.endTime = Date.now();
        stats.elapsedTime = stats.endTime - stats.startTime;

        if (!err) {
            // remove the amazon response quotes
            stats.etag = response.ETag.replace(/"/g, '');

            if (stats.etag === stats.md5) {
                stats.dataVerified = true;
            } else {
                stats.dataVerified = false;
                stats.message = util.format('file copy failed, hashes do not match: file md5 %s, S3 etag %s...', stats.md5, stats.etag);
                err = new Error( stats.message );
            }
        }

        if (err) {
            log.error("copy failed: ", err.message);
            stats.error = err.message;

            copier.emit('error', stats);
        }

        log.info('copy complete, stats:', util.format('%j', stats));
        copier.emit('complete', stats);
    };

    this.readFileCallback = function(err, data) {
        if (err) return copier.copyCompleteCallback( err );

        stats.message = 'file data read';
        stats.md5 = crypto.createHash('md5').update( data ).digest( 'hex' );


        log.info('copy user file:', sourceFile, 'to S3:', bucket + '/' + key,', bytes:', data.length);

        var params = {
            Bucket:bucket,
            Key:key,
            ACL:acl,
            Body:data,
            ContentType:mime.lookup( key )
        };

        log.info('mime-type: ', params.ContentType);

        s3.putObject( params, copier.copyCompleteCallback );
    };

    this.readFile = function() {
        stats.message = 'read the source file: ' + sourceFile;
        log.info(stats.message);

        copier.emit('progress', stats);

        fs.readFile(sourceFile, copier.readFileCallback);
    };

    this.statFileCallback = function(err, fileStat) {
        stats.message = 'file stat complete';
        if (err) {
            log.error( err.message );
            log.info('exiting without copy...');

            stats.message = 'exiting without copy';

            copier.copyCompleteCallback( err );
        } else {
            log.debug( fileStat );
            stats.fileSize = fileStat.size;
            stats.fileMTime = fileStat.mtime;

            copier.emit('progress', stats);
            copier.readFile();
        }
    };

    this.copy = function() {
        // begin with a new stats object
        stats = {
            message:'read file stats for ' + sourceFile,
            startTime:Date.now(),
            sourceFile:sourceFile
        };

        log.info( stats.message );

        copier.emit('progress', stats);

        fs.stat(sourceFile, copier.statFileCallback);
    };

    // constructor validations
    if (!log) throw new Error('copier must be constructed with a log');
    if (!bucket) throw new Error('copier must be constructed with a bucket name');
    if (!s3) throw new Error('copier must be constructed with an S3 object');
    if (!sourceFile) throw new Error('copier must be constructed with a source file name');
    if (!key) throw new Error('copier must be constructed with a target key');

    events.EventEmitter.call( this );
};

util.inherits( CopyToS3, events.EventEmitter );

module.exports = CopyToS3;
