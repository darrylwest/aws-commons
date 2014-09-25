/**
 * module exports
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/13/14 10:14 AM
 */
module.exports = {
    commons:{
        AWSCommonsFactory: require('./lib/AWSCommonsFactory'),
        CopyToS3: require('./lib/CopyToS3'),
        SESMailer: require( './lib/SESMailer')
    },
    mocks: {
        MockS3: require('./test/mocks/MockS3')
    },
    fixtures: {
        S3Dataset: require('./test/fixtures/S3Dataset')
    }
};