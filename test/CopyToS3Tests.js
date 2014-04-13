/**
 * @class CopyToS3Tests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 8:00 PM
 */
var should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createLogger(),
    CopyToS3 = require('../lib/CopyToS3' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('CopyToS3', function() {
    'use strict';

    // suppress all but the worst log messages for tests
    log.setLevel('fatal');

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.bucket = 'test-bucket';
        opts.s3 = new MockS3();
        opts.sourceFile = './fixtures/test-file.txt';
        opts.key = 'testKey';

        return opts;
    };

    describe('#instance', function() {
        var methods = [
                'copy',
                'statFileCallback',
                'readFile',
                'readFileCallback',
                'copyCompleteCallback',
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

        it('should create an instance of CopyToS3', function() {
            var copier = new CopyToS3( createOptions() );

            should.exist( copier );
            copier.should.be.instanceof( CopyToS3 );
        });

        it('should have all known methods by size and name', function() {
            var copier = new CopyToS3( createOptions() );
            // console.log( dash.methods( copier ));
            dash.methods( copier ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                copier[ method ].should.be.a( 'function' );
            });
        });
    });
});