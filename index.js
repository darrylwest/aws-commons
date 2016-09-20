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
        CopyFromS3: require( './lib/CopyFromS3' ),
        S3ObjectList: require('./lib/S3ObjectList'),
        SESMailer: require( './lib/SESMailer' ),
        SNSProvider: require( './lib/SNSProvider' )
    },
    mocks: {
        MockS3: require( './test/mocks/MockS3' ),
        MockSES: require( './test/mocks/MockSES' ),
        MockSESMailer: require( './test/mocks/MockSESMailer' )
    },
    fixtures: {
        S3Dataset: require( './test/fixtures/S3Dataset' )
    }
};
