/**
 * @class MockS3Tests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/13/14 3:21 PM
 */
const should = require('chai').should(),
    S3Dataset = require('./fixtures/S3Dataset' ),
    MockS3 = require('./mocks/MockS3' );

describe('MockS3', function() {
    'use strict';

    const mock = new MockS3(),
        dataset = new S3Dataset();

    describe('#instance', function() {
        it('should create an instance of MockS3', function() {
            should.exist( mock );
            mock.should.be.instanceof( MockS3 );
        });
    });

    describe('listBuckets', function() {
        it('should list random buckets', function(done) {
            const callback = function(err, data) {
                should.not.exist( err );
                should.exist( data );

                data.RequestId.length.should.be.above( 8 );

                data.Buckets.length.should.be.above( 5 );
                should.exist( data.Owner.ID );
                should.exist( data.Owner.DisplayName );

                done();
            };

            mock.listBuckets( callback );
        });
    });

    describe('getObject', function() {
        // TODO create cache data and assign to mock; search for one or more of the known objects
        it('should return a known object', function(done) {
            const cache = mock.clearCache(),
                params = dataset.createPutParams(),
                key = mock.createKey( params );

            cache[ key ] = dataset.createObject();

            const callback = function(err, data) {
                should.not.exist( err );
                should.exist( data );

                done();
            };

            mock.getObject( params, callback );
        });

        it('should return an error if the object is not found', function(done) {
            const cache = mock.clearCache(),
                params = dataset.createPutParams();

            const callback = function(err, data) {
                should.exist( err );
                should.not.exist( data );

                done();
            };

            mock.getObject( params, callback );
        });
    });

    describe('putObject', function() {
        it('should put data and return an expeced response', function(done) {
            const cache = mock.clearCache(),
                params = dataset.createPutParams(),
                key = mock.createKey( params );

            const callback = function(err, data) {
                should.not.exist( err );
                should.exist( data );

                var obj = cache[ key ];
                should.exist( obj );

                done();
            };

            mock.putObject( params, callback );
        });
    });
});
