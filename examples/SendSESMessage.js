#!/usr/bin/env node
/**
 * SendSESMessage
 *
 * @author: darryl.west@roundpeg.com
 * @created: 9/24/14 6:31 PM
 */
var VERSION = '0.1.1',
    path = require('path'),
    parser = require('commander' ),
    SESMailer = require('../lib/SESMailer' ),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory');

var log = require('simple-node-logger' ).createSimpleLogger(),
    opts = {
        log:log,
        keyfile:path.join( __dirname, 'keys.enc' )
    },
    factory = AWSCommonsFactory.createInstance( opts ),
    ses = factory.createSESConnection(),
    mailer;

opts.ses = factory.createSESConnection();

mailer = new SESMailer( opts );

var model = mailer.createEMailModel();

// now set the to/subject/body
