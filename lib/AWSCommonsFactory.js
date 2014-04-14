/**
 * @class AWSCommonsFactory
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 4:48 PM
 */
var dash = require('lodash' ),
    aws = require('aws-sdk');

var AWSCommonsFactory = function(options) {
    'use strict';

    var factory = this,
        log = options.log,
        keys = options.keys,
        base64Keys = options.base64Keys,
        s3 = options.s3,
        ses = options.ses;

    /**
     * creates an S3 connection object
     *
     * @returns the S3 connection object
     */
    this.createS3Connection = function() {
        if (!s3) {
            log.info('create an s3 connection object');

            var keys = factory.parseKeys();

            s3 = new aws.S3( keys );
        }

        return s3;
    };

    /**
     * parses the base64 encoded key string and extracts the aws node to return the keys
     *
     * @returns the aws key object
     */
    this.parseKeys = function() {
        if (!keys) {
            log.info('parse the aws keys');

            var json = new Buffer( base64Keys, 'base64' ).toString('ascii' ),
                keyObject = JSON.parse( json );

            log.info('key object version: ', keyObject.version);
            keys = keyObject.aws;

            if (!keys.accessKeyId || !keys.secretAccessKey) {
                log.fatal('aws access keys do not contain access and/or secret keys: ', json);
                throw new Error('AWS access keys must exist');
            }
        }

        return keys;
    };


    // constructor validations
    if (!log) throw new Error('factory must be constructed with a log');
    if (!base64Keys) throw new Error('factory must be constructed with base 64 key string');
};

AWSCommonsFactory.createInstance = function(options) {
    'use strict';

    if (!options) options = {};

    // if no log was supplied, then create one
    if (!options.log) {
        options.log = require('simple-node-logger' ).createLogger();
    }

    // read the file if supplied
    if (options.keyfile) {
        options.log.info('read the key file from ', options.keyfile);
        options.base64Keys = require('fs').readFileSync( options.keyfile, 'utf8' );
    }

    // TODO determine base64 keys or key file; if file then look up
    if (!options.environment) options.environment = 'development';

    return new AWSCommonsFactory( options );
};

module.exports = AWSCommonsFactory;

