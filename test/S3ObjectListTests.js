/**
 * @class S3ObjectListTests
 *
 * @author: darryl.west@raincity.com
 * @created: 4/27/14 2:32 PM
 */
const should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createSimpleLogger(),
    S3ObjectList = require('../lib/S3ObjectList' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('S3ObjectList', function() {
    'use strict';

    log.setLevel('fatal');

    const createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.bucket = 'test-bucket';
        opts.s3 = new MockS3();

        return opts;
    };

    describe('#instance', function() {
        const methods = [
            'list',
            'listCompleteCallback',
            'filter',
            'parseObject',
            'setBucket',
            'setMaxKeys',
            'setPrefix',
            'setMarker'
        ];

        it('should create an instance of S3ObjectList', function() {
            var lister = new S3ObjectList( createOptions() );

            should.exist( lister );
            lister.should.be.instanceof( S3ObjectList );
        });

        it('should have all known methods by size and name', function() {
            const lister = new S3ObjectList( createOptions() );
            // console.log( dash.functions( copier ));
            dash.functions( lister ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                lister[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('#list', function() {
        var lister = new S3ObjectList( createOptions() );

        it('should list objects from a known bucket', function(done) {
            lister.on('complete', function(results) {
                should.exist( results );

                should.exist( results.list );
                results.list.length.should.equal( 3 );

                done();
            });

            lister.on('error', function(err) {
                should.not.exist( err );
                done();
            });

            lister.list();
        });
    });
});
