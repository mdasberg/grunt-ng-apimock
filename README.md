# grunt-ng-apimock [![Build Status](https://travis-ci.org/mdasberg/grunt-ng-apimock.svg?branch=master)](https://travis-ci.org/mdasberg/grunt-ng-apimock)

> Grunt plugin that provides the ability to use scenario based api mocking of angular apps

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

## The "karma_sonar" task

### Overview
In your project's Gruntfile, add a section named `karma_sonar` to the data object passed into `grunt.initConfig()`.

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

### Options

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  ngApimocks: {
    options: {
    
    },
    your_target: {      
    }
  }
})

```

### Howto write mocks
There are a couple of rules to follow.

1. For each api call create a separate file
2. Each file needs to follow the format below.

```json
{
  "expression": "your expression here (ie a regex without the leading and trailing '/' or a string)",
  "method": "the http method (ie GET)",
  "responses": {
    "some-meaningful-scenario-name": { 
      "status": 200,
      "data": {},
      "headers": {}, 
      "statusText": ""
    },
    "some-other-meaningful-scenario-name": {
      "data": {}
    }
  }
}

```

### Howto serve selected mocks
To be able to use the selected mocks you need to do two things:

1. Add the generated ng-apimock.js file to your index.html
2. Add the index.html file to your connect configuration

The interface looks like this:

![alt tag](https://github.com/mdasberg/grunt-ng-apimock/blob/master/img/web-interface-grunt-ng-apimock.png)

#### Add the generated ng-apimock.js file to your index.html
Just add the following script after your code injects like this

```html
<head>
  <script src="/path/to/angular.js" ></script>
  <script src="/path/to/myapp.js" ></script>
  <script src="/path/to/ng-apimock.js" ></script> 
</head>

```

#### Add the index.html file to your connect configuration
If you are running grunt-contrib-connect you can do add the following staticServe block to your configuration

```js
{
    connect: {
        yourTarget: {
            options: {
                middleware: function (connect) {
                    return [
                        connect().use('/mocking', serveStatic('path/to/the/generated/mocking/index.html')),
                        connect().use('/', serveStatic('some-path-where-your-sources-are'))
                    ];
                }
            }
        }
    }
}

```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

