#!/usr/bin/env node
/**
 * PublishSNSMessage
 *
 * @uathor: darryl.west@raincitysoftware.com
 * @created: 9/25/14 6:31 PM
 */

var parser = require('commander' ),
    path = require('path'),
    SNSProvider = require('../index' ).commons.SNSProvider,
    AWSCommonsFactory = require('../index').commons.AWSCommonsFactory;

var log = require('simple-node-logger').createSimpleLogger(),
    opts = {
        log:log,
        keyfile:path.join( __dirname, 'keys.enc' )
    },
    factory = AWSCommonsFactory.createInstance( opts ),
    provider;

opts.sns = factory.createSNSConnection();

provider = new SNSProvider( opts );

provider.publish( 'YOUR-TOPIC', 'YOUR-MESSAGE', function(err, results) {
    if (err) {
        log.error( err );
    } else {
        log.info( results );
    }
});