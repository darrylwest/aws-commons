/**
 * @class CopyFromS3Tests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2016.09.08
 */
const should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createSimpleLogger(),
    CopyFromS3 = require('../lib/CopyFromS3' ),
    MockS3 = require('./mocks/MockS3' ),
    S3Dataset = require('./fixtures/S3Dataset');

describe('CopyFromS3', function() {
    'use strict';

    log.setLevel('fatal');

    const createOptions = function() {
        const opts = {};

        opts.log = log;
        opts.bucket = 'test-bucket';
        opts.s3 = new MockS3();
        opts.destFile = path.join( __dirname, './fixtures/test-output-file.txt');
        opts.key = 'testKey';

        return opts;
    };

    describe('#instance', function() {
        const methods = [
            'copy',
            'copyCompleteCallback'
        ];

        it('should create an instance of CopyFromS3', function() {
            const copier = new CopyFromS3( createOptions() );

            should.exist( copier );
            copier.should.be.instanceof( CopyFromS3 );
        });

        it('should have all known methods by size and name', function() {
            const copier = new CopyFromS3( createOptions() );
            // console.log( dash.functions( copier ));
            dash.functions( copier ).length.should.equal( methods.length );
            methods.forEach(method => {
                copier[ method ].should.be.a( 'function' );
            });
        });
    });
});

