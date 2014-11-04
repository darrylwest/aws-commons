/**
 * @class MockSES
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 11/3/14 6:16 PM
 */
var uuid = require('node-uuid' );

var MockSES = function() {
    'use strict';

    var mock = this;

    this.sendEmail = function(params, callback) {
        var result = {
            ResponseMetadata: {
                RequestId: uuid.v4()
            },
            MessageId: '00000-' + uuid.v4() + '-000000'
        };

        callback(null, result);
    };
};

module.exports = MockSES;