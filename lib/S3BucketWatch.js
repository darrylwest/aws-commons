/**
 * @class S3BucketWatch
 * @class watch a bucket for object changes and additions.
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/28/14 10:35 AM
 */
const events = require('events'),
    util = require('util' ),
    dash = require('lodash');

const S3BucketWatch = function(options) {
    'use strict';

    const watcher = this,
        log = options.log,
        s3 = options.s3,
        bucket = options.bucket,
        sleepInterval = dash.isNumber( options.sleepInterval ) ? options.sleepInterval : 10000;

    let enabled = false,
        objectList = {},
        threadId = null;

    this.start = function() {
        if (!threadId) {
            log.debug('begin watching bucket: ', bucket, ' with interval: ', sleepInterval);

            s3.listObjects( { Bucket:bucket }, watcher.listCallback );

            threadId = setInterval(function() {
                log.debug('list bucket contents: ');
                enabled = true;

                s3.listObjects( { Bucket:bucket }, watcher.listCallback );
            }, sleepInterval);
        }
    };

    this.listCallback = function(err, data) {
        if (err) {
            dash.defer(function() {
                watcher.emit('error', err);
            });
        } else {
            const listSize = dash.size( objectList ),
                contents = data.Contents;

            contents.forEach( function(item) {
                const obj = watcher.processListItem( item ),
                    original = dash.find( objectList, { key:obj.key });

                if (!original) {
                    objectList[ obj.key ] = obj;

                    if (enabled) {
                        log.info( 'fire change event, new object: ', obj );
                        watcher.emit('change', obj, 'added');
                    }
                } else if (original.etag !== obj.etag ) {
                    obj.lastVersion = original;
                    objectList[ obj.key ] = obj;

                    if (enabled) {
                        log.info( 'fire change event, updated object: ', obj );
                        watcher.emit('change', obj, 'modified');
                    }
                } else {
                    log.debug('no change object: ', obj );
                }
            });

            if (enabled) {
                // TODO compare Contents list to object list to discover deletes
                if (listSize > contents.length) {
                    log.info('list items have been removed...');

                    watcher.processDeletes( contents );
                }
            } else {
                log.info( 'initial list size: ', dash.size( objectList ));
            }

            // notify the the list is ready
            watcher.emit('listAvailable', dash.size( objectList ));
        }
    };

    this.processDeletes = function(list) {
        log.info('process the deletes');
        const keys = dash.keys( objectList );

        keys.forEach(function(key) {
            const ref = dash.find( list, { Key:key } );
            if (!ref) {
                const item = objectList[ key ];
                log.info('delete item from object list: ', key );

                watcher.emit('change', item, 'deleted');
                delete objectList[ key ];
            }
        });

        log.info('new object list size: ', dash.size( objectList ));
    };

    this.getContentList = function() {
        return dash.clone( objectList );
    };

    this.processListItem = function(item) {
        const obj = {
            key:item.Key,
            modified:item.LastModified,
            etag:item.ETag,
            size:item.Size
        };

        return obj;
    };

    this.stop = function() {
        if (threadId) {
            log.info('stop watching bucket');
            clearInterval( threadId );
            enabled = false;
        }
    };

    // constructor validations
    (function() {
        if (!log) {
            throw new Error('watcher must be constructed with a log');
        }
        if (!s3) {
            throw new Error('watcher must be constructed with an S3 object');
        }
        if (!bucket) {
            throw new Error('watcher must be constructed with a bucket name');
        }
    })();


    events.EventEmitter.call( this );
};

util.inherits( S3BucketWatch, events.EventEmitter );

module.exports = S3BucketWatch;