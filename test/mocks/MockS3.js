/**
 * @class MockS3
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 8:29 PM
 */
var dash = require('lodash' ),
    casual = require('casual' ),
    S3Dataset = require('../fixtures/S3Dataset');

var MockS3 = function() {
    'use strict';

    var mock = this,
        dataset = new S3Dataset();

    this.listBuckets = function(callback) {
        var data = {
            Buckets:dataset.createBucketList(),
            Owner:{
                ID:dataset.createId(),
                DisplayName:dataset.createDisplayName()
            },
            RequestId:dataset.createRequestId()
        };

        dash.defer( callback, null, data );
    };

    this.getObject = function(params, callback) {
        dash.defer( callback, new Error('not implemented yet'), null );
    };

    this.putObject = function(params, callback) {
        dash.defer( callback, new Error('not implemented yet'), null );
    };

    // these are all the known methods for S3 as of 2014-04-12
    var methods = [
        'abortMultipartUpload',
        'addAllRequestListeners',
        'addContentType',
        'completeMultipartUpload',
        'computeContentMd5',
        'computeSha256',
        'constructor',
        'copyObject',
        'createBucket',
        'createMultipartUpload',
        'deleteBucket',
        'deleteBucketCors',
        'deleteBucketLifecycle',
        'deleteBucketPolicy',
        'deleteBucketTagging',
        'deleteBucketWebsite',
        'deleteObject',
        'deleteObjects',
        'dnsCompatibleBucketName',
        'endpointSuffix',
        'escapePathParam',
        'expiredCredentialsError',
        'extractData',
        'extractError',
        'getBucketAcl',
        'getBucketCors',
        'getBucketLifecycle',
        'getBucketLocation',
        'getBucketLogging',
        'getBucketNotification',
        'getBucketPolicy',
        'getBucketRequestPayment',
        'getBucketTagging',
        'getBucketVersioning',
        'getBucketWebsite',
        'getLatestServiceClass',
        'getLatestServiceVersion',
        // 'getObject',
        'getObjectAcl',
        'getObjectTorrent',
        'getSignedUrl',
        'getSignerClass',
        'hasGlobalEndpoint',
        'headBucket',
        'headObject',
        'initialize',
        'isRegionCN',
        'isRegionV4',
        // 'listBuckets',
        'listMultipartUploads',
        'listObjectVersions',
        'listObjects',
        'listParts',
        'loadServiceClass',
        'makeRequest',
        'makeUnauthenticatedRequest',
        'networkingError',
        'numRetries',
        'paginationConfig',
        'pathStyleBucketName',
        'populateURI',
        'putBucketAcl',
        'putBucketCors',
        'putBucketLifecycle',
        'putBucketLogging',
        'putBucketNotification',
        'putBucketPolicy',
        'putBucketRequestPayment',
        'putBucketTagging',
        'putBucketVersioning',
        'putBucketWebsite',
        // 'putObject',
        'putObjectAcl',
        'restoreObject',
        'retryDelays',
        'retryableError',
        'serviceInterface',
        'setEndpoint',
        'setupRequestListeners',
        'successfulResponse',
        'throttledError',
        'uploadPart',
        'uploadPartCopy',
        'waitFor',
        'willComputeChecksums'
    ];

    methods.forEach(function(method) {
        mock[ method ] = function() {
            throw new Error('not implemented yet');
        };
    });
};

module.exports = MockS3;