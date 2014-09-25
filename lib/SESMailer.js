/**
 * @class SESMailer
 *
 * @author: darryl.west@roundpeg.com
 * @created: 9/24/14 5:22 PM
 */
var events = require('events'),
    util = require('util' ),
    dash = require('lodash');

var SESMailer = function(options) {
    'use strict';

    var mailer = this,
        log = options.log,
        ses = options.ses,
        config = options.emailConfig;

    this.createEMailParams = function(params) {
        if (!params) params = {};

        params.Source = config.source;

        return params;
    };

    // constructor validations
    if (!log) throw new Error('lister must be constructed with a log');
    if (!ses) throw new Error('lister must be constructed with an ses object');

    events.EventEmitter.call( this );
};

util.inherits( SESMailer, events.EventEmitter );

module.exports = SESMailer;
