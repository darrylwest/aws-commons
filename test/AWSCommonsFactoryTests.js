/**
 * @class AWSCommonsFactoryTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 4:56 PM
 */
var log = require('simple-node-logger' ).createLogger();

describe('AWSCommonsFactory', function() {
    'use strict';

    

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.base64Keys = 'ya'; // TODO create a simulated keys

        return opts;
    };

    describe('#instance', function() {
        it('should create an instance of AWSCommonsFactory');
    });
});
