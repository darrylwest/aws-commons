/**
 * @class AWSCommonsFactory
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 4:48 PM
 */
var dash = require('lodash' );

var AWSCommonsFactory = function(options) {
    'use strict';

    var factory = this,
        log = options.log,
        base64Keys = options.base64Keys,
        s3 = options.s3,
        ses = options.ses;

    this.createS3Connection = function() {
        if (!s3) {
            log.info('create an s3 connection object');


        }

        return s3;
    };


    // constructor validations
    if (!log) throw new Error('factory must be constructed with a log');
};

AWSCommonsFactory.newInstance = function(options) {
    'use strict';

    if (!options) options = {};

    // TODO determine base64 keys or key file; if file then look up
    if (!options.environment) options.environment = 'development';


    return new AWSCommonsFactory( options );
};

module.exports = AWSCommonsFactory;

