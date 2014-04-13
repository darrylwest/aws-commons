/**
 * @class AWSCommonsFactoryTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 4:56 PM
 */
var should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createLogger(),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

describe('AWSCommonsFactory', function() {
    'use strict';

    log.setLevel('fatal');

    var createBase64Keys = function() {
        var keys = {
            version:'2.0',
            aws:{
                accessKeyId:'MyTestAccessKey',
                secretAccessKey:'MyTestSecretAccessKey'
            }
        };

        var json = JSON.stringify( keys );

        return new Buffer( JSON.stringify( keys ) ).toString('base64');
    };

    var createOptions = function() {
        var opts = {};

        opts.environment = 'test';
        opts.log = log;
        opts.base64Keys = createBase64Keys();

        return opts;
    };

    describe('#instance', function() {
        var methods = [
            'createS3Connection',
            'parseKeys'
        ];

        it('should create an instance of AWSCommonsFactory', function() {
            var factory = new AWSCommonsFactory( createOptions() );
            should.exist( factory );

            factory.should.be.an.instanceof( AWSCommonsFactory );
        });

        it('should create an instance of AWSCommonsFactory from static constructor', function() {
            var factory = AWSCommonsFactory.newInstance( createOptions() );

            should.exist( factory );

            factory.should.be.an.instanceof( AWSCommonsFactory );
        });

        it('should have all known methods by size and name', function() {
            var factory = new AWSCommonsFactory( createOptions() );

            dash.methods( factory ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                factory[ method ].should.be.a( 'function' );
            });
        });

        it('should execute all known methods', function() {
            var factory = new AWSCommonsFactory( createOptions() );

            methods.forEach(function(method) {
                var obj = factory[ method ]();

                should.exist( obj );
            });
        });
    });
});
