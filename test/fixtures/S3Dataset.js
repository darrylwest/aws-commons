/**
 *
 * @author: darryl.west@roundpeg.com
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

    this.createId = function() {
        return crypto.createHash('sha256').update(casual.sentence).digest('hex');
    };

    this.createDisplayName = function() {
        return casual.company_name;
    };
};
/* jshint +W106 */

module.exports = S3Dataset;