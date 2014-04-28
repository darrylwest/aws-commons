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
        objectList = [];

    this.start = function() {
        log.info('begin watching bucket: ', bucket);
        keepWatching = true;

        // establish the initial object list

        // wait for idle time to expire

        // list the bucket objects and compare lists

        // if changes are detected, fire a change event

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