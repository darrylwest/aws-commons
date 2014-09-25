/**
 * @class SNSProvider
 *
 * @author: darryl.west@roundpeg.com
 * @created: 9/25/14 7:17 AM
 */
var events = require('events'),
    util = require('util' ),
    dash = require('lodash');

var SNSProvider = function(options) {
    'use strict';

    var provider = this,
        log = options.log,
        sns = options.sns;

    this.publish = function(topic, message, callback) {
        log.info('publish to: ', topic, ', message: ', message);

        var sentCallback = function(err, response) {
            if (err) {
                log.error( err );
                provider.emit('error', err);
            } else {
                log.info('message published: ', response);
                provider.emit('sent', response);
            }

            if (typeof callback === 'function') {
                return callback( err, response );
            }
        };

        var params = {
            Message:message,
            TargetArn:topic
        };

        sns.publish( params, sentCallback );

    };

    events.EventEmitter.call( this );
};

util.inherits( SNSProvider, events.EventEmitter );

module.exports = SNSProvider;