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

    var createOptions = function() {
        var opts = {};

        opts.environment = 'test';
        opts.log = log;
        // opts.base64Keys = 'ya'; // TODO create a simulated keys

        return opts;
    };

    describe('#instance', function() {
        var methods = [
            'createS3Connection'
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
    });
});
