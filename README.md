# grunt-ng-apimock [![Build Status](https://travis-ci.org/mdasberg/grunt-ng-apimock.svg?branch=master)](https://travis-ci.org/mdasberg/grunt-ng-apimock) [![npm version](https://img.shields.io/node/v/grunt-ng-apimock.svg)](https://github.com/mdasberg/grunt-ng-apimock) [![dependency Status](https://img.shields.io/david/mdasberg/grunt-ng-apimock.svg)](https://david-dm.org/mdasberg/grunt-ng-apimock) [![devDependency Status](https://img.shields.io/david/dev/mdasberg/grunt-ng-apimock.svg)](https://david-dm.org/mdasberg/ggrunt-ng-apimock#info=devDependencies) [![npm downloads](https://img.shields.io/npm/dm/grunt-ng-apimock.svg?style=flat-square)](https://www.npmjs.com/package/grunt-ng-apimock)

> Grunt plugin that provides the ability to use scenario based api mocking:
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
There are a couple of rules to follow.

1. For each api call create a separate file
2. Each file needs to follow the format below.

```js
{
  "expression": "your expression here (ie a regex without the leading and trailing '/' or a string)",
  "method": "the http method (ie GET, POST, PUT or DELETE)",
  "name": "identifiable name for this service call"  // if non is provided, expression$$method will be used
  "isArray": "indicates if the response data is an array or object",
  "responses": {
    "some-meaningful-scenario-name": {
      "default": true, // if false or not provided this response will not be used as default
      "status": 200, // optional - defaults to 200
      "data": {}, // optional
      "headers": {}, // optional - defaults to {}
      "statusText": "" // optional 
    },
    "some-other-meaningful-scenario-name": {
      "data": {}
    }
  }
}

```

## Howto use global variables
If for instance, you have date sensitive information in you mocks, mock data is not flexible enough.
You can use global variables for this. By surrounding a value in the response.data with %%theVariableName%%,
you can make your data more flexible, like this:

```json
"responses": {
    "some-meaningful-scenario-name": {
        "data": {
            "today": '%%today%%
        }
    }
}
```

For local development you can use the web interface to add, change or delete variables.
For protractor you can use the following commands
```js
     ngApimock.setGlobalVariable(name, value); // to add or update
     ngApimock.deleteGlobalVariable(name); // to delete 
```

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

As you have configured both the [connect middleware](#add-the-connect-middleware) and the [mocking interface](#add-the-mocking-interface-to-your-connect-configuration), everything 
  should work out of the box. By default all the responses configured as default, will be returned if the expression matches.
  
  If you would like to change the selected scenario, you can go to http://localhost:9000/mocking and use the interface to change the selected scenario or variables

The interface looks like this:

![alt tag](https://github.com/mdasberg/grunt-ng-apimock/blob/master/img/web-interface-grunt-ng-apimock.png)



### Howto use for your protractor tests.
As you are building an [AngularJS](https://angularjs.org/) application you will probably use [Protractor](https://angular.github.io/protractor/#/) for testing your UI.

Protractor provides the ability to inject a mock module in your application by adding the following to your protractor test.

```js
describe('Some test', function () {
    browser.addMockModule('modName', function() {
        angular.module('modName', []).value('foo', 'bar');
    });
});
```

To serve the mock data from the json files that we created for running our application locally with mock data, you can replace the block above with this

```js
describe('Some test', function () {
    var ngApimock = require('.tmp/mocking/protractor.mock'); // or the path/to/protractor.mock.js
    ngApimock.selectScenario(require('path/to/mocks/some.json'), 'nok'); // nok is the name of the scenario    
    ngApimock.selectScenario('name attribute in mock.json', 'ok'); // ok is the name of the scenario
    ngApimock.setGlobalVariable('someKey', 'someValue'); // add or update a global variable which will be used to replace in the response data.

    it('should do something', function() {
        ngApimock.selectScenario('name of some api', 'another'); // at runtime you can change a scenario
    });
 });
   
```

By default all the scenario's marked as default will be returned if the expression matches. So you only need to add ngApimock.selectScenario in case your test need
other scenario data to be returned.

NgApimock also works when running multiple tests concurrent, by using the protract session id of the test. 
This ensures that changing a scenario in one test, will not effect another test. 

### Available functions
All these functions are protractor promises, so they can be chained.

#### selectScenario(json, scenarionName)
Selects the given scenario
  
#### resetScenarios()
Resets the scenarios (only passthroughs are set)

#### setGlobalVariable(key, value)
Adds or updates the global key/value pair 

#### deleteGlobalVariable(key)
Remove the global variable matching the key

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


