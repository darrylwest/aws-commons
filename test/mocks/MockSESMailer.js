/**
 * @class MockSesMailer
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 11/3/14 6:04 PM
 */
var MockLogger = require('simple-node-logger').mocks.MockLogger,
    MockSES = require('./MockSES' ),
    SESMailer = require('../../lib/SESMailer');

var MockSESMailer = {};

MockSESMailer.createInstance = function() {
    'use strict';

    let opts = {};

    opts.log = MockLogger.createLogger('MockSESMailer');
    opts.ses = new MockSES();

    return new SESMailer( opts );
};

module.exports = MockSESMailer;
