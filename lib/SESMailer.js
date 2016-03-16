/**
 * @class SESMailer
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/24/14 5:22 PM
 */
const events = require('events'),
    util = require('util' ),
    dash = require('lodash');

const SESMailer = function(options) {
    'use strict';

    const mailer = this,
        log = options.log,
        ses = options.ses,
        config = options.emailConfig;

    const EMailModel = function() {
        let model = this,
            params = {
                Destination:{
                    ToAddresses:[]
                },
                Message:{
                    Body:{
                        Html:{
                            Data:null
                        }
                    },
                    Subject:{
                        Data:null
                    }
                },
                ReplyToAddresses:[],
                Source:null
            };

        this.setToAddress = function(addr) {
            if (dash.isArray( addr )) {
                params.Destination.ToAddresses = addr;
            } else {
                params.Destination.ToAddresses.push( addr );
            }
        };

        this.setCCAddress = function(addr) {
            if (dash.isArray( addr )) {
                params.Destination.CcAddresses = addr;
            } else {
                if (!params.Destination.CcAddresses) {
                    params.Destination.CcAddresses = [];
                }

                params.Destination.CcAddresses.push( addr );
            }
        };

        this.setReplyTo = function(addr) {
            if (dash.isArray( addr )) {
                params.ReplyToAddresses = addr;
            } else {
                params.ReplyToAddresses.push( addr );
            }
        };

        this.setSubject = function(subject) {
            params.Message.Subject.Data = subject;
        };

        this.setBody = function(body) {
            params.Message.Body.Html.Data = body;
        };

        this.setSource = function(addr) {
            params.Source = addr;
        };

        this.setFrom = function(from) {
            params.Source = from;
        };

        this.createParams = function() {
            let obj = dash.clone( params );

            if (!obj.Source) {
                obj.Source = obj.ReplyToAddresses[ 0 ];
            }

            return obj;
        };
    };

    this.createEMailModel = function() {
        return new EMailModel();
    };

    this.send = function(params, callback) {
        log.info('send params: ', JSON.stringify( params ));

        const sentCallback = function(err, response) {
            if (err) {
                log.error( err );
                mailer.emit('error', err);
            } else {
                log.info('message sent: ', response);
                mailer.emit('sent', response);
            }

            if (typeof callback === 'function') {
                return callback( err, response );
            }
        };

        ses.sendEmail( params, sentCallback );
    };

    // constructor validations
    (function() {
        if (!log) {
            throw new Error('lister must be constructed with a log');
        }
        if (!ses) {
            throw new Error('lister must be constructed with an ses object');
        }
    })();


    events.EventEmitter.call( this );
};

util.inherits( SESMailer, events.EventEmitter );

module.exports = SESMailer;
