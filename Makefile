
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
	ln -s `pwd`/bin/S3Lister.js /usr/local/bin/s3lister
	ln -s `pwd`/bin/S3CopyFile.js /usr/local/bin/s3copyfile

version:
	@( cd app ; node app --version )

.PHONY:	test
.PHONY:	version
.PHONY:	npm
.PHONY:	publish
