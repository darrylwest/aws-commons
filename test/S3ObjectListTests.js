/**
 * @class S3ObjectList
 *
 * @author: darryl.west@raincity.com
 * @created: 4/27/14 2:32 PM
 */
var should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createLogger(),
    S3ObjectList = require('../lib/S3ObjectList' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('S3ObjectList', function() {
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
                'list',
                'listCompleteCallback',
                'setBucket',
                'setMaxKeys',
                'setPrefix',
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

        it('should create an instance of S3ObjectList', function() {
            var lister = new S3ObjectList( createOptions() );

            should.exist( lister );
            lister.should.be.instanceof( S3ObjectList );
        });

        it('should have all known methods by size and name', function() {
            var lister = new S3ObjectList( createOptions() );
            // console.log( dash.methods( copier ));
            dash.methods( lister ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                lister[ method ].should.be.a( 'function' );
            });
        });
    });
});