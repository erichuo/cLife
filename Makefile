TESTS = $(shell find test -type f -name "*.test.js")
REPORTER = list
# MOCHA_OPTS = --ui tdd --ignore-leaks

test:
	clear
	echo Starting test *******************************************
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	${TESTS}
	echo Ending test
	
.PHONY: test