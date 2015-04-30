#!/usr/bin/env node
/**
 * @class S3PutGetObject
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/13/14 3:47 PM
 */
var path = require('path'),
    dash = require('lodash'),
    crypto = require('crypto' ),
    randomData = require('random-fixture-data' ),
    log = require('simple-node-logger').createSimpleLogger(),
    AWSCommonsFactory = require('../index').commons.AWSCommonsFactory;
    bucket = 'unittest.roundpeg.org',
    key = 'aws-commons-test.txt',
    opts = {
        log:log,
        keyfile:path.join( __dirname, 'keys.enc' )
    };

var factory = AWSCommonsFactory.createInstance( opts ),
    s3 = factory.createS3Connection(),
    body = new Buffer( randomData.sentences( 10 ) ),
    md5 = crypto.createHash('md5').update( body ).digest('hex' ),
    putParams = {
        Bucket:bucket,
        Key:key,
        ACL:'public-read',
        Body:body
    },
    getParams = {
        Bucket:bucket,
        Key:key
    };

var putObjectCallback = function(err, data) {
    if (err) throw err;
    log.info('put response: ', JSON.stringify( data ));

    var etag = data.ETag.replace(/"/g, '');

    if (etag === md5) {
        log.info('success! file copied to ', putParams.bucket);
    } else {
        log.error('data copy failed: md5:', md5, 'does not match etag', etag);
    }
};

var getObjectCallback = function(err, data) {
    if (err) {
        log.error('get object error: ', err.message);
    }

    log.info( 'get response:', JSON.stringify( data ));
    dash.keys( data ).forEach(function(key) {
        log.info( key, '->', data[ key ] );
    });
};

s3.putObject( putParams, putObjectCallback );
s3.getObject( getParams, getObjectCallback );
