# grunt-ng-apimock [![Build Status](https://travis-ci.org/mdasberg/grunt-ng-apimock.svg?branch=master)](https://travis-ci.org/mdasberg/grunt-ng-apimock) [![npm version](https://img.shields.io/node/v/grunt-ng-apimock.svg)](https://github.com/mdasberg/grunt-ng-apimock) [![dependency Status](https://img.shields.io/david/mdasberg/grunt-ng-apimock.svg)](https://david-dm.org/mdasberg/grunt-ng-apimock) [![devDependency Status](https://img.shields.io/david/dev/mdasberg/grunt-ng-apimock.svg)](https://david-dm.org/mdasberg/ggrunt-ng-apimock#info=devDependencies) [![npm downloads](https://img.shields.io/npm/dm/grunt-ng-apimock.svg?style=flat-square)](https://www.npmjs.com/package/grunt-ng-apimock)

> Grunt plugin that wraps around [ng-apimock](https://github.com/mdasberg/ng-apimock) which provides the ability to use scenario based api mocking:
 - for local development 
 - for protractor testing
 
## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ng-apimock --save-dev

```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ng-apimock');

```

## The "ngApimock" task

### Overview
In your project's Gruntfile, add a section named `ngApimock` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ngApimock: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})

```

This task will process the mock data provided in the configuration and make it accessible for connect as middleware.

### Options

#### options.defaultOutputDir
Type: `String`
Default: '.tmp/mocks/'

Should be the location where the ngApimock plugin will put it's generated files.

#### src
Type: `String`
Mandatory: true

Should be the location where the mock json files are located.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  ngApimocks: {
    options: {
        defaultOutputDir: '...' // the output directory
    },
    your_target: {   
       src: '...' // the directory containing all your json mocks
    }
  }
})

```

### Howto write mocks
see [Howto write mocks]( https://github.com/mdasberg/ng-apimock#howto-write-mocks)

## Howto use global variables
see [Howto use global variables](https://github.com/mdasberg/ng-apimock#howto-use-global-variables)

### Howto serve selected mocks
To be able to use the selected mocks you need to do two things:

1. Add the connect middleware
2. Add the mocking interface to your connect configuration

#### Add the connect middleware
When running grunt-contrib-connect you can do add the following middleware block to your configuration


```js
{
    connect: {
        yourTarget: {
            options: {
                middleware: function (connect) {
                    return [
                        (require('grunt-ng-apimock/lib/utils').ngApimockRequest),
                        ...
                        connect().use('/', serveStatic('some-path-where-your-sources-are'))
                    ];
                }
            }
        }
    }
}
```

#### Add the mocking interface to your connect configuration
When running grunt-contrib-connect you can do add the following staticServe block to your configuration

```js
{
    connect: {
        yourTarget: {
            options: {
                middleware: function (connect) {
                    return [
                        ...
                        connect().use('/mocking', serveStatic('path/to/the/generated/mocking/index.html')),
                        connect().use('/', serveStatic('some-path-where-your-sources-are'))
                    ];
                }
            }
        }
    }
}

```

### Howto use for local development
see [Howto use for local development](https://github.com/mdasberg/ng-apimock#howto-use-for-local-development)

### Howto use for your protractor tests.
see [Howto use for your protractor tests](https://github.com/mdasberg/ng-apimock#howto-use-for-your-protractor-tests)

### Available functions
see [Available functions](https://github.com/mdasberg/ng-apimock#available-functions)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


