
BIN = /usr/local/bin

all:
	@make npm
	@make test

npm:
	@npm install

test:
	@( [ -d node_modules ] || make npm )
	@( grunt test jshint )

jshint:
	@( [ -d node_modules ] || make npm )
	@( grunt jshint )

watch:
	@( grunt watchall )

install:
	[ -f $(BIN)/s3lister ] || ln -s `pwd`/bin/S3Lister.js $(BIN)/s3lister
	[ -f  $(BIN)/s3copyfile ] || ln -s `pwd`/bin/S3CopyFile.js $(BIN)/s3copyfile

version:
	@( cd app ; node app --version )

.PHONY:	test
.PHONY:	version
.PHONY:	npm
.PHONY:	publish
