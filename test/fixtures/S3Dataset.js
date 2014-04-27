/**
 * @class S3Dataset
 * @classdesc S3Dataset provides methods and data used for testing s3 modules
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 4/13/14 9:27 AM
 */
var casual = require('casual' ),
    crypto = require('crypto' ),
    uuid = require('node-uuid');

/* jshint -W106 */ // underscores used in casual
var S3Dataset = function() {
    'use strict';

    var dataset = this;

    this.createBucketList = function(count) {
        var list = [];

        if (!count || count < 1) {
            count = 10;
        }

        while (count-- > 0) {
            list.push( dataset.createBucket() );
        }

        return list;
    };

    this.createBucket = function() {
        var bucket = {
            Name: casual.word,
            CreationDate: new Date( casual.unix_time )
        };

        return bucket;
    };

    this.createRequestId = function() {
        return casual.random.toString(20).substr(2).toUpperCase();
    };

    this.createRandomDate = function() {
        return new Date( casual.unix_date );
    };

    this.createMD5Hash = function(text) {
        return crypto.createHash('md5').update( text ).digest('hex');
    };

    this.createId = function() {
        return crypto.createHash('sha256').update(casual.sentence).digest('hex');
    };

    this.createDisplayName = function() {
        return casual.company_name;
    };

    this.createPutParams = function(body) {
        if (!body) body = new Buffer( casual.sentences( 5 ));
        var params = {
            Bucket:casual.domain,
            Key:casual.word + '.txt',
            ACL:'public-read',
            Body:body
        };

        return params;
    };

    this.createObject = function(body) {
        if (!body) body = new Buffer( casual.sentences(3) );
        var obj = {
                AcceptRanges: 'bytes',
                LastModified: dataset.createRandomDate(),
                ContentLength:body.length,
                ETag:'"' + dataset.createMD5Hash( body ) + '"',
                ContentType:'application/octet-stream',
                Metadata: {},
                Body:body
            };

        return obj;
    };

    this.createObjectList = function(bucket) {
        var data,
            owner = { DisplayName:'fred', ID:'2345' };

        data = {
            CommonPrefixes: [],
            Contents:[
                {
                    Key: 'ama.jama/308/16/jld120024f1.png',
                    LastModified: new Date( casual.unix_time ),
                    ETag: '"c32e0de7e751a9d68d7d4c8c1922e167"',
                    Size: 37217,
                    Owner: owner,
                    StorageClass: 'STANDARD'
                },
                {
                    Key: 'ama.jama/308/16/jpg120031.xml',
                    LastModified: new Date( casual.unix_time ),
                    ETag: '"f46c2da51b35e49db79c5319f5b5c818"',
                    Size: 6328,
                    Owner: owner,
                    StorageClass: 'STANDARD'
                },
                {
                    Key: 'ama.jama/308/16/jwr120137-2-1_xml.html',
                    LastModified: new Date( casual.unix_time ),
                    ETag: '"7a90234e0c765b40ff93dca919cb7dcf"',
                    Size: 11897,
                    Owner: owner,
                    StorageClass: 'STANDARD'
                }
            ],
            Name: bucket,
            Prefix: 'ama.jama',
            Marker: '',
            MaxKeys: 1000,
            'Encoding-Type': 'url',
            IsTruncated: false
        };

        return data;
    };

};
/* jshint +W106 */

module.exports = S3Dataset;