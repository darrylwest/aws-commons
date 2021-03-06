/**
 * @class S3ObjectList
 * @classdesc List all or a filtered set of objects for the specified S3 bucket. List with or without
 * details such as
 *
 * @author: darryl.west@raincity.com
 * @created: 4/27/14 2:20 PM
 */
const events = require('events'),
    util = require('util' ),
    dash = require('lodash');

const S3ObjectList = function(options) {
    'use strict';

    const lister = this,
        log = options.log,
        s3 = options.s3;

    let bucket = options.bucket,
        prefix = options.prefix,
        maxKeys = dash.isNumber( options.maxKeys ) ? options.maxKeys : 1000,
        marker = options.marker;

    /**
     * override this to eliminate from the result list or invoke an alternate parser
     *
     * @param obj - the s3 file object
     * @returns the parsed item
     */
    this.filter = function(obj) {
        const item = lister.parseObject( obj );

        return item;
    };

    /**
     * parse the s3 object and return a structured item with key, etag, lastModified and size
     *
     * @param obj - the s3 file object
     * @returns {{key: *, etag: *, lastModified: *, size: *}}
     */
    this.parseObject = function(obj) {
        const item = {
            key:obj.Key,
            etag:obj.ETag,
            lastModified:obj.LastModified,
            size:obj.Size
        };

        return item;
    };

    /**
     * callback from the s3 query
     *
     * @param err
     * @param data
     */
    this.listCompleteCallback = function(err, data) {
        var size = 0,
            lastKey;

        if (err) {
            lister.emit( 'error', err );
        } else {
            let results = {
                bucket:data.Name,
                maxKeys:data.MaxKeys,
                marker:data.Marker,
                nextMarker:data.NextMarker,
                isTruncated:data.IsTruncated,
                prefix:data.Prefix,
                list:[]
            };

            data.Contents.forEach(function(obj) {
                lastKey = obj.Key;
                
                const item = lister.filter( obj );

                if (item) {
                    results.list.push( item );
                }
            });

            size = results.list.length;

            if (results.isTruncated) {
                results.nextMarker = lastKey;
            }

            log.info('item count: ', size, ', truncated: ', results.isTruncated);

            lister.emit( 'complete', results );
        }
    };

    /**
     * invoke this to start the list process
     *
     * @returns {*}
     */
    this.list = function() {
        const params = {};

        params.Bucket = bucket;
        params.MaxKeys = maxKeys;

        if (prefix) {
            params.Prefix = prefix;
        }

        if (marker) {
            params.Marker = marker;
        }

        log.info('list objects in ', bucket, ' with params: ', params);

        return s3.listObjects( params, lister.listCompleteCallback );
    };

    this.setBucket = function(name) {
        bucket = name;
    };

    this.setMaxKeys = function(max) {
        maxKeys = max;
    };

    this.setPrefix = function(pfx) {
        prefix = pfx;
    };

    this.setMarker = function(name) {
        marker = name;
    };

    // constructor validations
    (function() {
        if (!log) {
            throw new Error('lister must be constructed with a log');
        }
        if (!s3) {
            throw new Error('lister must be constructed with an S3 object');
        }
    })();


    events.EventEmitter.call( this );
};

util.inherits( S3ObjectList, events.EventEmitter );

module.exports = S3ObjectList;
