/**
 * @class AWSCommonsFactoryTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 4:56 PM
 */
var should = require('chai').should(),
    log = require('simple-node-logger' ).createLogger(),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

describe('AWSCommonsFactory', function() {
    'use strict';



    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.base64Keys = 'ya'; // TODO create a simulated keys

        return opts;
    };

    describe('#instance', function() {
        var factory = new AWSCommonsFactory( createOptions() );

        it('should create an instance of AWSCommonsFactory', function() {
            should.exist( factory );
            
            factory.should.be.an.instanceof( AWSCommonsFactory );
        });
    });
});
