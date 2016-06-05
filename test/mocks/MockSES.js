/**
 * @class MockSES
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 11/3/14 6:16 PM
 */
var uuid = require('node-uuid' );

var MockSES = function() {
    'use strict';

    const mock = this;

    this.messages = [];

    this.sendEmail = function(params, callback) {
        // TODO : do a smoke test on the params; to, from, subject, body, etc...

        const result = {
            ResponseMetadata: {
                RequestId: uuid.v4()
            },
            MessageId: '00000-' + uuid.v4() + '-000000'
        };

        mock.messages.push( params );

        callback(null, result);
    };
};

module.exports = MockSES;
