/**
 * @class MockSES
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 11/3/14 6:16 PM
 */
var MockSES = function() {
    'use strict';

    var mock = this;

    this.sendEmail = function(params, callback) {
        var result = {
            ResponseMetadata: {
                RequestId: '3df74375-444e-11e4-bd8e-357568d2425b'
            },
            MessageId: '00000148aa4ba26b-038a03ec-b0fd-4772-b763-95c73ce69ab8-000000'
        };

        callback(null, result);
    };
};

module.exports = MockSES;