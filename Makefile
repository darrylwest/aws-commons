JSFILES=bin/*.js lib/*.js test/*/*.js index.js watcher.js
TESTFILES=test/*.js
JSHINT=node_modules/.bin/jshint
REPORTER=node_modules/jshint-stylish/
MOCHA=node_modules/.bin/mocha

BIN = /usr/local/bin

all:
	@make npm
	@make test

npm:
	@npm install

test:
	@( $(MOCHA) $(TESTFILES) )
	@( make jshint )

test-short:
	@( $(MOCHA) --reporter dot $(TESTFILES) )

jshint:
	@( $(JSHINT) --verbose --reporter $(REPORTER) $(TESTFILES) $(JSFILES) )

watch:
	@( ./watcher.js )

install:
	[ -f $(BIN)/s3lister ] || ln -s `pwd`/bin/S3Lister.js $(BIN)/s3lister
	[ -f  $(BIN)/s3copyfile ] || ln -s `pwd`/bin/S3CopyFile.js $(BIN)/s3copyfile
	[ -f  $(BIN)/s3pullfile ] || ln -s `pwd`/bin/S3PullFile.js $(BIN)/s3pullfile

version:
	@( cd app ; node app --version )

.PHONY:	test
.PHONY:	version
.PHONY:	npm
.PHONY:	publish
