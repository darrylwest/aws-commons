/**
 * @class S3ObjectList
 * @classdesc List all or a filtered set of objects for the specified S3 bucket. List with or without
 * details such as
 *
 * @author: darryl.west@raincity.com
 * @created: 4/27/14 2:20 PM
 */
var events = require('events'),
    util = require('util');

var S3ObjectList = function(options) {
    'use strict';

    var lister = this,
        log = options.log,
        bucket = options.bucket,
        s3 = options.s3;

    this.list = function() {

    };

    // constructor validations
    if (!log) throw new Error('lister must be constructed with a log');
    if (!bucket) throw new Error('lister must be constructed with a bucket name');
    if (!s3) throw new Error('lister must be constructed with an S3 object');

    events.EventEmitter.call( this );
};

util.inherits( S3ObjectList, events.EventEmitter );

module.exports = S3ObjectList;
