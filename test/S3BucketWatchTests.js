/**
 * @class S3BucketWatchTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 4/28/14 10:37 AM
 */
var should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createSimpleLogger(),
    S3BucketWatch = require('../lib/S3BucketWatch' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('S3BucketWatch', function() {
    'use strict';

    log.setLevel('info');

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.bucket = 'test-bucket';
        opts.s3 = new MockS3();

        return opts;
    };

    describe('#instance', function() {
        var methods = [
                'start',
                'listCallback',
                'processListItem',
                'getContentList',
                'processDeletes',
                'stop',
                // inherited from event emitter
                'addListener',
                'emit',
                'listeners',
                'on',
                'once',
                'removeAllListeners',
                'removeListener',
                'setMaxListeners'
            ];

        it('should create an instance of S3BucketWatch', function() {
            var watcher = new S3BucketWatch( createOptions() );

            should.exist( watcher );
            watcher.should.be.instanceof( S3BucketWatch );
        });

        it('should have all known methods by size and name', function() {
            var watcher = new S3BucketWatch( createOptions() );
            // console.log( dash.methods( copier ));
            dash.methods( watcher ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                watcher[ method ].should.be.a( 'function' );
            });
        });
    });
});
