AWS Commons - Node.js Utilities
===

[![NPM version](https://badge.fury.io/js/aws-commons.svg)](http://badge.fury.io/js/aws-commons)
[![Build Status](https://travis-ci.org/darrylwest/aws-commons.svg?branch=master)](https://travis-ci.org/darrylwest/aws-commons)

A collection of small node/AWS utilities to help with common AWS operations as defined by aws-sdk.  Utilities can be used in CLI scripts or as class objects in larger projects.

## Installation

Install through npm using this:

	npm install aws-commons --save

Or if you want to use the command line scripts, install from github like this:

	git clone https://github.com/darrylwest/aws-commons.git
	
	make npm
	sudo make install
	
The scripts require that your keys file be stored in your $HOME/.ssh folder.

## AWS Commons Factory

A factory class to create connections to S3, SQS, etc.  The factory is created with a base64 encoded set of keys modeled in JSON.  The decoded data structure looks like this:

	{
		"version":"2.0",
		"aws":{
			"accessKeyId":"<your access key>",
			"secretAccessKey":"<your secret access key>"
		}
	}

This structure decoded and parsed by the factory to create connections to S3, SES, etc.  The factory's key parser is public to enable overridding for alternate structures.  The version number is used by the factory to automatically switch to alternate parsing as new technologies are provided.

## Factory Instantiation

The AWSFactory is designed to work as a singleton by invoking it's static create method with the encoded set of access keys.  A typical use would be:

	// return an instance of the AWSFactory.  construtor must be supplied an encoded set of keys.
	var opts = {
		base64Keys:b64string
	};
	
	var factory = AWSCommonsFactory.createInstance( opts );

Or, rather than setting the string, you can specify the key file like this:

	var opts = {
		keyfile:'path/to/file'
	};
	
	var factory = AWSCommonsFactory.createInstance( opts );
	
Factory methods are used to create instances of AWS services.  Examples include:

	// create an S3 connection
	var s3 = factory.createS3Connection();
	
	// create an SES email connection 
	var ses = factory.createSESTransport();
	
	// create a connection to SQS
	var sqs = createSQSConnection();
	
## S3 Utilities

S3 utilities include small classes to read and copy file(s) from a file system to a specified S3 bucket, read object(s) from a specified bucket and watch a bucket for object updates.  Utilities are separated into stateful class objects with public callback methods to enable override at various steps.  Objects are evented to fire progress, complete and error events.  

### CopyToS3

The CopyToS3 utility reads a source file, calculates the md5 hash, then puts the object data to a specified bucket and key.  If any process fails, then entire process is aborted.  After the file has been copied, the md5 hash is compared to the response ETag to insure that the data signitures match.

A typical file copy example looks like this:

	
	// create the copy options
	var opts = {
		log:log, // and standard logger, e.g., winston, simple-node-logger, log4j, etc
		sourceFile:'path/to/mySourceFile.txt',
		bucket:'bucket-name',
		key:'destination/key/file.txt',
		mime:'text/plain', // optional
		s3:factory.createS3Connection();
	};
	
	// create the copier
	var copier = new CopyToS3( opts );
	
	// attatch some event listeners
	copier.on('complete', function(stats) {
		log.info('file copy completed: bytes transferred: ', stats.size());
	});
	
	copier.on('progress', function(msg) {
		log.info('copy progress: ', msg);
	});
	
	copier.on('error', function(err) {
		log.error('something went wrong: ', err.message);
	});
	
	copier.copy();

#### When To Use

The CopyToS3 utility should be used when you have a very large file that needs to be copied from the local file system to an S3 bucket.  This is typically done in a separate thread or even a separate process.

This can also be used as a simple helper to copy a small file from local file to S3 with minimal fuss.  Since CopyToS3 is stateful it can be used 

#### When not to use

If your application has existing object data where a file doesn't need to be read, then use s3.putObject();

### S3ObjectList

S3ObjectList can list all or a filtered set of objects for a given S3 bucket.  The list may include details such as last modified, size, etag/md5, and other metadata.

A typical example would look like this:

	var opts = {
		log:log, // and standard logger, e.g., winston, simple-node-logger, log4j, etc
		bucket:'bucket-name',
		s3:factory.createS3Connection();
	};

	var lister = new S3ObjectList( opts );

	lister.on('complete', function(results) {
		log.info( results );

		// results.list = object list
		results.list.forEach(function(item) {
			log.info('key: ', item.key);
		});
	});

	list.on('error', function(err) {
		log.error('list error: ', err.message);
	});

	lister.list();

	lister.setBucket('newBucketName');
	lister.list();
	
### S3BucketWatch

S3BucketWatch is an object watcher for a specified S3 Bucket.  Objects are periodically scanned and compared to a reference list for changes.  When changes are detected, a change event is fired.

A typical example:

	var opts = {
		log:log, // and standard logger, e.g., winston, simple-node-logger, log4j, etc
		bucket:'bucket-name',
		s3:factory.createS3Connection();
	};

	var watcher = new S3BucketWatch( opts );

	watcher.on('change', function(results) {
		log.info( results );

		// results.list = object list
		results.list.forEach(function(item) {
			log.info('key: ', item.key);
		});
	});

	watcher.on('error', function(err) {
		log.error('list error: ', err.message);
	});

	watcher.start();

	

## SES Utilities

_not implemented yet_

## Mocks

There is a MockS3 exposted for testing.

* MockS3



## Tests

Tests are written in mocha/chai using the should dialect.  Tests can be run from grunt or the make file:

	grunt test

or

	make test
	
or

	make watch
	

## Examples

### S3Connection

This small example lists all buckets owned by the specified user.  To run, your amazon keys must be set.  There is a helper function "__mkkey.sh__" to help create the required keys file.  It is used by all the examples.

### S3PutGetObject

Put an object, get an object and see what happens.  Test attempting to get an unknown object.

## Command Scripts

There are a few command scripts that can be installed using 'make install' (probably as sudo) or install manually.  Scripts are linked to /usr/local/bin/ so you need to clone the project to use the scripts.  They include:

* s3lister
* s3copyfile

- - -
<p><small><em>version 0.90.51 | copyright © 2014 rain city software</em></small></p>
