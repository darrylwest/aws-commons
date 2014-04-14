/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 4/13/14 3:21 PM
 */
var should = require('chai').should(),
    S3Dataset = require('./fixtures/S3Dataset' ),
    MockS3 = require('./mocks/MockS3' );

describe('MockS3', function() {
    'use strict';

    var mock = new MockS3(),
        dataset = new S3Dataset();

    describe('#instance', function() {
        it('should create an instance of MockS3', function() {
            should.exist( mock );
            mock.should.be.instanceof( MockS3 );
        });
    });

    describe('listBuckets', function() {
        it('should list random buckets', function(done) {
            var callback = function(err, data) {
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
        it('should return a known object');
    });

    describe('putObject', function() {
        it('should put data and return an expeced response', function(done) {
            var params = dataset.createPutParams(),
                callback;

            callback = function(err, data) {
                should.not.exist( err );
                should.exist( data );

                done();
            };

            mock.putObject( params, callback );
        });
    });
});