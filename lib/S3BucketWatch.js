/**
 * @class S3BucketWatch
 * @class watch a bucket for object changes and additions.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 4/28/14 10:35 AM
 */
var events = require('events'),
    util = require('util' ),
    dash = require('lodash');

var S3BucketWatch = function(options) {
    'use strict';

    var watcher = this,
        log = options.log,
        s3 = options.s3,
        bucket = options.bucket,
        keepWatching = false,
        objectList = {};

    this.start = function() {
        log.info('begin watching bucket: ', bucket);
        keepWatching = true;

        // establish the initial object list
        var params = {
            Bucket:bucket
        };

        s3.listObjects( params, watcher.listCallback );

        // wait for idle time to expire

        // list the bucket objects and compare lists

        // if changes are detected, fire a change event

    };

    this.listCallback = function(err, data) {
        if (err) {
            log.error( err );
        } else {
            data.Contents.forEach( function(item) {
                var obj = watcher.processListItem( item ),
                    original = dash.find( objectList, { key:obj.key });

                if (!original) {
                    objectList[ obj.key ] = obj;
                    log.info( 'new object: ', obj );
                } else if (original.etag !== obj.etag ) {
                    objectList[ obj.key ] = obj;
                    log.info( 'updated object: ', obj );
                } else {
                    log.info('no change object: ', obj );
                }

            });
        }
    };

    this.processListItem = function(item) {
        var obj = {
            key:item.Key,
            modified:item.LastModified,
            etag:item.ETag,
            size:item.Size
        };

        return obj;
    };

    this.stop = function() {
        log.info('stop watching bucket');
        keepWatching = false;
    };

    // constructor validations
    if (!log) throw new Error('watcher must be constructed with a log');
    if (!s3) throw new Error('watcher must be constructed with an S3 object');
    if (!bucket) throw new Error('watcher must be constructed with a bucket name');

    events.EventEmitter.call( this );
};

util.inherits( S3BucketWatch, events.EventEmitter );

module.exports = S3BucketWatch;