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
        log = options.log || require('simple-node-logger').createLogger(),
        base64Keys = options.base64Keys,
        s3 = options.s3,
        ses = options.ses;


};

AWSCommonsFactory.newInstance = function(options) {
    'use strict';

    // TODO determine base64 keys or key file; if file then look up

    return new AWSCommonsFactory( options );
};

module.exports = AWSCommonsFactory;

