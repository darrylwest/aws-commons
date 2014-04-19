#!/usr/bin/env node
/**
 * @class S3PutGetObject
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/13/14 3:47 PM
 */
var path = require('path'),
    crypto = require('crypto' ),
    casual = require('casual' ),
    log = require('simple-node-logger').createLogger(),
    AWSCommonsFactory = require('../lib/AWSCommonsFactory' ),
    bucket = 'unittest.roundpeg.org',
    key = 'aws-commons-test.txt',
    opts = {
        log:log,
        keyfile:path.join( __dirname, 'keys.enc' )
    };

var factory = AWSCommonsFactory.createInstance( opts ),
    s3 = factory.createS3Connection(),
    body = new Buffer( casual.sentences( 10 ) ),
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
    log.info('put response: ', data);

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

    log.info( 'get response:', data );
};

s3.putObject( putParams, putObjectCallback );
s3.getObject( getParams, getObjectCallback );
