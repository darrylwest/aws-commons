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
        dataset = new S3Dataset(),
        cache = {};

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
        var buf = new Buffer( casual.sentences(3) );
        var data = {
            AcceptRanges: 'bytes',
            LastModified: dataset.createRandomDate(),
            ContentLength:buf.length,
            ETag:dataset.createMD5Hash( buf ),
            ContentType:'binary/octet-stream',
            Metadata: {},
            Body:buf,
            RequestId:dataset.createRequestId()
        };

        dash.defer( callback, null, data );
    };

    this.putObject = function(params, callback) {
        var err,
            data;

        if (!params.Body) err = new Error('request must have a Body');
        if (!params.Bucket) err = new Error('request params must have a Bucket');
        if (!params.Key) err = new Error('request params must have a Key');

        if (!err) {
            data = {
                ETag:dataset.createMD5Hash( params.Body ),
                RequestId:dataset.createRequestId()
            };

            // TODO push to cache
        }

        dash.defer( callback, err, data );
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