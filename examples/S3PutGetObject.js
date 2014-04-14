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
    opts = {
        log:log,
        keyfile:path.join( __dirname, 'keys.enc' )
    };


var factory = AWSCommonsFactory.createInstance( opts ),
    s3 = factory.createS3Connection(),
    body = new Buffer( casual.sentences( 10 ) ),
    md5 = crypto.createHash('md5').update( body ).digest('hex' ),
    params;

params = {
    Bucket:bucket,
    Key:'aws-commons-test.txt',
    ACL:'public-read',
    Body:body
};

log.info('put text to bucket / key: ', params.Bucket, '/', params.Key );
var putObjectCallback = function(err, data) {
    if (err) throw err;
    log.info('put response: ', data);

    var etag = data.ETag.replace(/"/g, '');

    if (etag === md5) {
        log.info('success! file copied to ', params.bucket);
    } else {
        log.error('data copy failed: md5:', md5, 'does not match etag', etag);
    }
};

s3.putObject( params, putObjectCallback );