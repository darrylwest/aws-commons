/**
 * @class SNSProviderTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/25/14 7:26 AM
 */
const should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createSimpleLogger(),
    SNSProvider = require('../lib/SNSProvider'),
    S3Dataset = require('./fixtures/S3Dataset');

describe('SNSProviderTests', function() {
    'use strict';

    // suppress all but the worst log messages for tests
    log.setLevel('fatal');

    const MockSNS = function() {
        var mock = this;

        this.publish = function(params, callback) {
            var result = {
                ResponseMetadata: {
                    RequestId: '3df74375-444e-11e4-bd8e-357568d2425b'
                },
                MessageId: '00000148aa4ba26b-038a03ec-b0fd-4772-b763-95c73ce69ab8-000000'
            };

            callback(null, result);
        };
    };

    var createOptions = function() {
        const opts = {};

        opts.log = log;
        opts.ses = new MockSNS();

        return opts;
    };

    describe('#instance', function() {
        const methods = [
            'publish'
        ];

        it('should create an instance of SNSProvider', function() {
            var provider = new SNSProvider( createOptions() );

            should.exist( provider );
            provider.should.be.instanceof( SNSProvider );
        });

        it('should have all known methods by size and name', function() {
            var provider = new SNSProvider( createOptions() );

            dash.functions( provider ).length.should.equal( methods.length );
            methods.forEach(function(method) {

                provider[ method ].should.be.a( 'function' );
            });
        });
    });
});
