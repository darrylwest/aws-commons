/**
 * @class AWSCommonsFactoryTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 4:56 PM
 */
const should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createSimpleLogger(),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory'),
    aws = require('aws-sdk');

describe('AWSCommonsFactory', function() {
    'use strict';

    // suppress all but the worst log messages for tests
    log.setLevel('fatal');

    const createBase64Keys = function() {
        var keys = {
            version:'2.0',
            aws:{
                accessKeyId:'MyTestAccessKey',
                secretAccessKey:'MyTestSecretAccessKey'
            }
        };

        const json = JSON.stringify( keys );

        return new Buffer( JSON.stringify( keys ) ).toString('base64');
    };

    const createOptions = function() {
        var opts = {};

        opts.environment = 'test';
        opts.log = log;
        opts.base64Keys = createBase64Keys();

        return opts;
    };

    describe('#instance', function() {
        const methods = [
            'createS3Connection',
            'createSESConnection',
            'createSNSConnection',
            'parseKeys'
        ];

        it('should create an instance of AWSCommonsFactory', function() {
            const factory = new AWSCommonsFactory( createOptions() );
            should.exist( factory );

            factory.should.be.an.instanceof( AWSCommonsFactory );
        });

        it('should create an instance of AWSCommonsFactory from static constructor', function() {
            const factory = AWSCommonsFactory.createInstance( createOptions() );

            should.exist( factory );

            factory.should.be.an.instanceof( AWSCommonsFactory );
        });

        it('should have all known methods by size and name', function() {
            const factory = new AWSCommonsFactory( createOptions() );

            dash.functions( factory ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                factory[ method ].should.be.a( 'function' );
            });
        });

        it('should execute all known methods', function() {
            const factory = new AWSCommonsFactory( createOptions() );

            methods.forEach(function(method) {
                var obj = factory[ method ]();

                should.exist( obj );
            });
        });
    });

    describe('parseKeys', function() {
        it('should parse a set of known keys', function() {
            const factory = new AWSCommonsFactory( createOptions() ),
                keys = factory.parseKeys();

            should.exist( keys );
        });

        it('should fail to parse a bad set of keys', function() {
            const options = createOptions();
            var factory;

            options.base64Keys = 'bad-keys';
            factory = new AWSCommonsFactory( options );
            /* jshint -W068 : ignore IIFE wrapper */
            (function() {
                factory.parseKeys();
            }).should.throw();
            /* jshint +W068 */
        });
    });

    describe('createS3Connection', function() {
        const factory = new AWSCommonsFactory( createOptions() );

        it('should create an S3 connection object', function() {
            const s3 = factory.createS3Connection();

            should.exist( s3 );
            s3.should.be.instanceof( aws.S3 );
        });
    });
});
