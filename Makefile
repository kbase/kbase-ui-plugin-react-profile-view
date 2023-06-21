.PHONY: all test build docs

#
# Builds the app on the host, via docker containers
# Results end up in the build directory
#
build:
	scripts/build.sh