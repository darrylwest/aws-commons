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
};
/* jshint +W106 */

module.exports = S3Dataset;