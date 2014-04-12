
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

version:
	@( cd app ; node app --version )

.PHONY:	test
.PHONY:	version
.PHONY:	npm
