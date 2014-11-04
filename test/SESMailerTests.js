/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 9/24/14 5:32 PM
 */
var should = require('chai').should(),
    dash = require('lodash'),
    path = require('path' ),
    log = require('simple-node-logger' ).createSimpleLogger(),
    MockSES = require('./mocks/MockSES' ),
    SESMailer = require('../lib/SESMailer'),
    S3Dataset = require('./fixtures/S3Dataset');

describe('SESMailerTests', function() {
    'use strict';

    // suppress all but the worst log messages for tests
    log.setLevel('fatal');

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.ses = new MockSES();
        opts.emailConfig = {
            source:'myname@mydomain.com'
        };

        return opts;
    };

    describe('#instance', function() {
        var methods = [
            'createEMailModel',
            'send',
            // inherited from event emitter
            'addListener',
            'emit',
            'listeners',
            'on',
            'once',
            'removeAllListeners',
            'removeListener',
            'setMaxListeners'
        ];

        it('should create an instance of SESMailer', function() {
            var mailer = new SESMailer( createOptions() );

            should.exist( mailer );
            mailer.should.be.instanceof( SESMailer );
        });

        it('should have all known methods by size and name', function() {
            var mailer = new SESMailer( createOptions() );
            // console.log( dash.methods( copier ));
            dash.methods( mailer ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                mailer[ method ].should.be.a( 'function' );
            });
        });
    });
});
