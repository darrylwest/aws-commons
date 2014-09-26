#!/usr/bin/env node
/**
 * SendSESMessage
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/24/14 6:31 PM
 */
var parser = require('commander' ),
    path = require('path'),
    SESMailer = require('../index' ).commons.SESMailer,
    AWSCommonsFactory = require('../index').commons.AWSCommonsFactory;

var log = require('simple-node-logger' ).createSimpleLogger(),
    opts = {
        log:log,
        keyfile:path.join( __dirname, 'keys.enc' )
    },
    factory = AWSCommonsFactory.createInstance( opts ),
    mailer;

opts.ses = factory.createSESConnection();

mailer = new SESMailer( opts );

var model = mailer.createEMailModel();

// now set the to/subject/body
model.setSource( 'YOUR-SOURCE' );
model.setToAddress( 'YOUR-TO' );
model.setFrom( 'YOUR-FROM' );

model.setSubject('This is my subject' );
model.setBody('<h1>hello</h1><p>this is a test</p>');

mailer.send( model.createParams(), function(err, response) {
    if (err) throw err;
    log.info( response );
});
