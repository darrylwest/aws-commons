/**
 * @class MockS3
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/12/14 8:29 PM
 */
var dash = require('lodash' ),
    path = require('path' ),
    S3Dataset = require('../fixtures/S3Dataset');

var MockS3 = function() {
    'use strict';

    var mock = this,
        dataset = new S3Dataset(),
        cache = {};

    this.getCache = function() {
        return cache;
    };

    this.setCache = function(data) {
        if (!data) data = {};

        cache = data;

        return cache;
    };

    this.clearCache = function() {
        cache = {};
        return cache;
    };

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
        var id = path.join( params.Bucket, params.Key ),
            data = cache[ id ],
            err;

        if (!data) {
            err = new Error('not found');
        }

        dash.defer( callback, err, data );
    };

    this.createKey = function(params) {
        return path.join( params.Bucket, params.Key );
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

            // push to cache
            cache[ mock.createKey( params ) ] = dataset.createObject( params.Body );
        }

        dash.defer( callback, err, data );
    };

    this.listObjects = function(params, callback) {
        var err,
            data,
            request;

        if (!params.Bucket) err = new Error('request params must have a Bucket');

        if (!err) {
            data = dataset.createObjectList( params.Bucket );
            request = {
                service:{
                    config:{}
                },
                params:params
            };
        }

        dash.defer( callback, err, data );

        return request;
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