/**
 * @class CopyToS3Tests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 8:00 PM
 */
const should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createSimpleLogger(),
    CopyToS3 = require('../lib/CopyToS3' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('CopyToS3', function() {
    'use strict';

    // suppress all but the worst log messages for tests
    log.setLevel('fatal');

    const createOptions = function() {
        const opts = {};

        opts.log = log;
        opts.bucket = 'test-bucket';
        opts.s3 = new MockS3();
        opts.sourceFile = path.join( __dirname, './fixtures/test-file.txt');
        opts.key = 'testKey';

        return opts;
    };

    describe('#instance', function() {
        const methods = [
            'copy',
            'statFileCallback',
            'readFile',
            'readFileCallback',
            'copyCompleteCallback'
        ];

        it('should create an instance of CopyToS3', function() {
            const copier = new CopyToS3( createOptions() );

            should.exist( copier );
            copier.should.be.instanceof( CopyToS3 );
        });

        it('should have all known methods by size and name', function() {
            const copier = new CopyToS3( createOptions() );
            // console.log( dash.functions( copier ));
            dash.functions( copier ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                copier[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('copy', function() {
        it('should start the copy process by stating the specified file', function(done) {
            const copier = new CopyToS3( createOptions() );
            copier.statFileCallback = function(err, stat) {
                should.not.exist( err );
                should.exist( stat );

                done();
            };

            copier.copy();
        });

        it('should run the copy process and invoke the callback', function(done) {
            const copier = new CopyToS3( createOptions() );
            const callback = function(err, stat) {
                should.not.exist( err );
                should.exist( stat );

                done();
            };

            copier.copy( callback );
        });
    });

    describe('statFileCallback', function() {
        var copier = new CopyToS3( createOptions() );

        it('should call read file when invoked without errors');
        it('should set stat error message on error');
    });

    describe('readFile', function() {
        var copier = new CopyToS3( createOptions() );
        it('should read the source file');
    });

    describe('readFileCallback', function() {
        it('should set the S3 params');
    });

    describe('copyCompleteCallback', function() {
        it('should set stats for end and elapsed');
    });
});
