AWS Commons - Node.js Utilities
===

[![NPM version](https://badge.fury.io/js/aws-commons.svg)](http://badge.fury.io/js/aws-commons)
[![Build Status](https://travis-ci.org/darrylwest/aws-commons.svg?branch=master)](https://travis-ci.org/darrylwest/aws-commons)
[![Dependency Status](https://david-dm.org/darrylwest/aws-commons.svg)](https://david-dm.org/darrylwest/aws-commons)

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
			"secretAccessKey":"<your secret access key>",
            "region":"<the default region>"
		}
	}

This structure decoded and parsed by the factory to create connections to S3, SES, etc.  The factory's key parser is public to enable overriding for alternate structures.  The version number is used by the factory to automatically switch to alternate parsing as new technologies are provided.

## Factory Instantiation

The AWSFactory is designed to work as a singleton by invoking it's static create method with the encoded set of access keys.  A typical use would be:

	// return an instance of the AWSFactory.  constructor must be supplied an encoded set of keys.
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
	var ses = factory.createSESConnection();

	// create a connection to SQS
	var sqs = createSQSConnection();

## S3 Utilities

S3 utilities include small classes to read and copy file(s) from a file system to a specified S3 bucket, read object(s) from a specified bucket and watch a bucket for object updates.  Utilities are separated into stateful class objects with public callback methods to enable override at various steps.  Objects are evented to fire progress, complete and error events.

### CopyToS3

The CopyToS3 utility reads a source file, calculates the md5 hash, then puts the object data to a specified bucket and key.  If any process fails, then entire process is aborted.  After the file has been copied, the md5 hash is compared to the response ETag to insure that the data signatures match.

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
		
		// if the list isn't complete then set the marker and list again
		if (results.isTruncated) {
			lister.setMarker( results.nextMarker );
			lister.list();
		}
	});

	lister.on('error', function(err) {
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
		s3:factory.createS3Connection(),
        sleepInterval:6000 // 6 second loop
	};

	var watcher = new S3BucketWatch( opts ),
    	referenceList;

    watcher.on('listAvailable', function(size) {
    	log.info( 'list size: ', size );

        if (!referenceList) {
        	referenceList = watcher.getContentList();
        }
    });

	watcher.on('change', function(item, action) {
    	// action is added or modified or deleted
		log.info( item.key, ' was ', action );

		// item = key, etag, size, and modified date/time
		// do something with the changed item
	});

	watcher.on('error', function(err) {
		log.error('list error: ', err.message);
	});

	watcher.start();
	
When a file change is detected, the change event is fired with the S3 item data.  A typical entry looks like this:

```
	{
		"key":"todo.md",
		"modified":"2015-04-20T16:03:24.000Z",
		"etag":"f86b5810fc263a2f19637f35b3f27c3e",
		"size":211,
		"lastVersion":{
			"key":"todo.md",
			"modified":"2015-04-20T16:02:29.000Z",
			"etag":"\"b83526d91525f8b94a6c1ff537bd39f5\"",
			"size":177
		}
	}
```
The first entry shows the current file specs.  The lastVersion is what the item was compared to.  So, this file "todo.md" changed in size from 177 to 211 bytes; the modified date and etags also changed.

If the item is deleted, the action = "deleted" and the object looks like this:

```
	{
		"key":"todo.md",
		"modified":"2015-04-20T16:03:24.000Z",
		"etag":"f86b5810fc263a2f19637f35b3f27c3e",
		"size":211
	}
```


## SES Utilities

SESMailer is a thin wrapper around AWS/SES.  It makes it easy to create an SES connection, a parameters object and to send emails through SES.

A typical example:

	var opts = {
        log:log,
        ses:factory.createSESConnection
    };

    var mailer = new SESMailer( opts );

    var model = mailer.createEMailParams();

    model.setToAddress( 'myemail@email.com' );
    model.setCCAddress( [ ccme@email.com, ccyou@email.com ] );
    model.setSubject( 'This is my subject line...' );
    model.setBody( 'This is my body <p>with tags</p>' );
    model.setFrom( 'from@email.com' );

	mailer.send( model.createParams() );
    mailer.on('sent', function(err, response) {
    	if (err) return err;
        console.log( response );
    };

    // or with a callback

    mailer.send( params, function(err, response) {
    	if (err) return err;
        console.log( response );
    };

## SNS Provider

SNSProvider is a thin wrapper around AWS/SNS.  It makes it easy to send simple notifications to specific consumers.



## Mocks

* MockS3
* MockSES
* MockSESMailer

### MockS3

The mock is easy to use.  Just set data in the mock's cache then read it back with standard S3 commands.  Here is a simple example:

```
var mock = new MockS3(),
	text = 'this is my data stored on S3...',
	params = {
		Bucket:'mybucket',
		Key:'mykey'
	};

mock.setCache({
		id:'mybucket/mykey',
		data:{
			AcceptRanges:'bytes',
			LastModified:new Date(),
			ContentLength:text.length,
			ETag:'"1871f707997d270ca949256c00979b94"',
			ContentType:'application/octet-stream',
			Metadata:{},
			Body:{
				type:'Buffer',
				data:new Buffer( text )
			}
		}
	});

mock.getObject( params, function(err, data) {
	should.not.exist( err );
	should.exist( data );
	
	data.Body.toString('utf8').should.equal( text );
	
	done();
});
	
```

## Tests

Tests are written in mocha/chai using the should dialect.  Tests can be run from npm or the make file:


	make test

or

	make watch


## Examples

### S3Connection

This small example lists all buckets owned by the specified user.  To run, your amazon keys must be set.  There is a helper function "__mkkey.sh__" to help create the required keys file.  It is used by all the examples.

### S3PutGetObject

Put an object, get an object and see what happens.  Test attempting to get an unknown object.

## Command Scripts

There are a few command scripts that can be installed using 'make install' (probably as sudo) or install manually.  Scripts are linked to /usr/local/bin/ so you need to clone the project to use the scripts.

### S3Lister
```
Usage: s3lister [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -b --bucket <bucket>          set the bucket to list (required)
    -p --prefix <prefix>          set the optional prefix
    -a --accessFile <accessFile>  set the access file
    -v --verbose                  verbose listing
```

### S3CopyFile
```
Usage: s3copyfile [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -f --file <file>              set the source file
    -b --bucket <bucket>          set the destination bucket
    -k --key <key>                set the file key, e.g., destination name
    -a --accessFile <accessFile>  set the access file
```
- - -
<p><small><em>copyright © 2014-2015 rain city software | version 0.91.90</em></small></p>
