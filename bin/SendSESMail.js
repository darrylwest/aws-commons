#!/usr/bin/env node

/**
 * SendSESMessage
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/24/14 6:31 PM
 */

'use strict';

const parser = require('commander' ),
    path = require('path'),
    uuid = require('uuid'),
    crypto = require('crypto'),
    SESMailer = require('../index' ).commons.SESMailer,
    AWSCommonsFactory = require('../index').commons.AWSCommonsFactory;

const generate = function() {
    const buf = crypto.randomBytes( 6 );
    const key = buf.toString("hex");

    console.log( key, key.length );
    const value = [ key.substr(0, 4), key.substr(4,4), key.substr(8) ].join(' ');
    console.log( value );

    return value;
};

const log = require('simple-node-logger' ).createSimpleLogger(),
    opts = {
        log:log,
        keyfile:path.join( process.env.HOME, '.ssh/keys.enc' )
    },
    factory = AWSCommonsFactory.createInstance( opts );

let mailer;

opts.ses = factory.createSESConnection();

mailer = new SESMailer( opts );

const model = mailer.createEMailModel();

// now set the to/subject/body
model.setSource( uuid.v4() );
model.setToAddress( 'darryl.west@raincitysoftware.com' );
model.setFrom( 'dpw@raincitysoftware.com' );

model.setSubject('Test key...' );
model.setBody('msg: ' + generate() );

mailer.send( model.createParams(), function(err, response) {
    if (err) throw err;
    log.info( response );
});

