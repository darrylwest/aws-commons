/**
 * module exports
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/13/14 10:14 AM
 */
module.exports = {
    commons:{
        AWSCommonsFactory: require( './lib/AWSCommonsFactory' ),
        CopyToS3: require( './lib/CopyToS3' ),
        S3ObjectList: require('./lib/S3ObjectList'),
        SESMailer: require( './lib/SESMailer' ),
        SNSProvider: require( './lib/SNSProvider' )
    },
    mocks: {
        MockS3: require( './test/mocks/MockS3' )
    },
    fixtures: {
        S3Dataset: require( './test/fixtures/S3Dataset' )
    }
};
