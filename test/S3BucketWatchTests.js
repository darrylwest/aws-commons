/**
 * @class S3BucketWatchTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/28/14 10:37 AM
 */
const should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createSimpleLogger(),
    S3BucketWatch = require('../lib/S3BucketWatch' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('S3BucketWatch', function() {
    'use strict';

    log.setLevel('info');

    const createOptions = function() {
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
            'stop'
        ];

        it('should create an instance of S3BucketWatch', function() {
            var watcher = new S3BucketWatch( createOptions() );

            should.exist( watcher );
            watcher.should.be.instanceof( S3BucketWatch );
        });

        it('should have all known methods by size and name', function() {
            var watcher = new S3BucketWatch( createOptions() );
            // console.log( dash.functions( copier ));
            dash.functions( watcher ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                watcher[ method ].should.be.a( 'function' );
            });
        });
    });
});
