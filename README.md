AWS Commons - Node.js Utilities
===
A collection of small node utilities to help with common AWS operations as defined by aws-sdk.  Utilities can be used in CLI scripts or as class objects in larger projects.

Installation
===
*When this project finally gets published to npm, you will be able it install using* 

	npm install aws-commons

*Until then, you can clone the project, run the tests, check out the examples, etc.*

AWS Commons Factory
===
A factory class to create connections to S3, SQS, etc.  The factory is created with a base64 encoded set of keys modeled in JSON.  The decoded data structure looks like this:

	{
		"version":"2.0",
		"aws":{
			"accessKeyId":"<your access key>",
			"secretAccessKey":"<your secret access key>"
		}
	}

This structure decoded and parsed by the factory to create connections to S3, SES, etc.  The factory's key parser is public to enable overridding for alternate structures.  The version number is used by the factory to automatically switch to alternate parsing as new technologies are provided.

Factory Instantiation
===
The AWSFactory is designed to work as a singleton by invoking it's static create method with the encoded set of access keys.  A typical use would be:

	// return an instance of the AWSFactory.  construtor must be supplied an encoded set of keys.
	var opts = {
		base64Keys:b64string
	};
	
	var factory = AWSCommonsFactory.newInstance( opts );

Factory methods are used to create instances of AWS services.  Examples include:

	// create an S3 connection
	var s3 = factory.createS3Connection();
	
	// create an SES email connection 
	var ses = factory.createSESTransport();
	
	// create a connection to SQS
	var sqs = createSQSConnection();
	
S3 Utilities
===
S3 utilities include small classes to read and copy file(s) from a file system to a specified S3 bucket, read object(s) from a specified bucket and watch a bucket for object updates.  Utilities are separated into stateful class objects with public callback methods to enable override at various steps.  Objects are evented to fire progress, complete and error events.  

### CopyToS3

The CopyToS3 utility reads a source file, calculates the md5 hash, then puts the object data to a specified bucket and key.  If any process fails, then entire process is aborted.  After the file has been copied, the md5 hash is compared to the response ETag to insure that the data signitures match.

A typical file copy example looks like this.

	
	// create the copy options
	var opts = {
		log:log, // and standard logger, e.g., winston, simple-node-logger, log4j, etc
		sourceFile:'path/to/mySourceFile.txt',
		bucket:'bucket-name',
		destKey:'mySourceFile.txt',
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

SES Utilities
===

Mocks
===
### MockS3

### MockMailer


Tests
===
Tests are written in mocha/chai using the should dialect.  Tests can be run from grunt or the make file:

	grunt test

or

	make test
	
or

	make watch
	

Examples
===


- - -
<p><small><em>version 0.9.1</em></small></p>