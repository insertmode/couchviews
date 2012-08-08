.PHONY: all
.PHONY: test
all:
	npm install

test: all
	./node_modules/.bin/mocha --reporter spec --require should
