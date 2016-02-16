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

### Options

#### options.defaultOutputDir
Type: `String`
Default: '.tmp/mocks/'

Should be the location where the ngApimock plugin will put it's generated files.

#### src
Type: `String`
Mandatory: true

Should be the location where the mock json files are located.

#### moduleName
Type: `String`
Mandatory: true

Should be the name of your angular module in which the mocks are going to be used.

#### dependencies.angular
Type: `String`
Mandatory: true

Should be the location where to find angular (NOTE: use the url path)

#### defaultPassThrough
Type: `Array`
Mandatory: false

Should be an object array of  

```js
    {
        "expression": "...", // "your expression here (ie a regex without the leading and trailing '/' or a string)"
        "method": "GET" // Optional - defaults to 'GET'
    }
```

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  ngApimocks: {
    options: {
        defaultOutputDir: '...' // the output directory
    },
    your_target: {   
       src: '...', // the directory containing all your json mocks
       moduleName: '...', // the name of your angular module
       dependencies: {
           angular: '...' // the uri path to angular.js
       }
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
  "method": "the http method (ie GET)",
  "isArray": "indicates if the response data is an array or object"
  "responses": {
    "some-meaningful-scenario-name": { 
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

Leaving the response object empty like below
```json
...
"responses": {
    "some-meaningful-scenario-name": {}
}

```
will result in

```js
$httpbackend.when(...).passThrough(); 
```

### Howto serve selected mocks
To be able to use the selected mocks you need to do two things:

1. Add the generated ng-apimock.js file to your index.html
2. Add the index.html file to your connect configuration

The interface looks like this:

![alt tag](https://github.com/mdasberg/grunt-ng-apimock/blob/master/img/web-interface-grunt-ng-apimock.png)

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

### Howto reuse this setup for your protractor tests.
As you are building an [AngularJS](https://angularjs.org/) application you will probably use [Protractor](https://angular.github.io/protractor/#/) for testing your UI.
And of course you will use $httpbackend to mock your apis.

Protractor provides the ability to inject a mock module in your application by adding the following to your protractor test.

```js
describe('Some test', function () {
    browser.addMockModule('modName', function() {
        angular.module('modName', []).value('foo', 'bar');
    });
});
```

To reuse the json files that we created for running our application locally with mock data, you can replace the block above with this

```js
describe('Some test', function () {
    var ngApimock = require('.tmp/mocking/protractor.mock'); // or the path/to/protractor.mock.js
    ngApimock.selectScenario(require('path/to/mocks/partials.json'), 'passThrough'); // passThrough is the name of the scenario    
    ngApimock.selectScenario(require('path/to/mocks/countryService.json'), 'ok'); // ok is the name of the scenario
    ngApimock.addMockModule(); // add the mock module
    ngApimock.setGlobalVariable('someKey', 'someValue'); // add or update a global variable which will be used to replace in the response data.

    it('should do something', function() {
        ngApimock.selectScenario(require('path/to/mocks/partials.json'), 'another'); // at runtime you can change a scenario
    });
 });
   
```

### Available functions

#### selectScenario(json, scenarionName)
Selects the given scenario
  
#### addMockModule()
Makes the mock module available to protractor
  
#### removeMockModule()
Makes the mock module unavailable to protractor

#### resetScenarios()
Resets the scenarios (only passthroughs are set)

#### setGlobalVariable(key, value)
Adds or updates the global key/value pair 

#### resetGlobalVariables()
Removes all global variables

#### deleteGlobalVariable(key)
Remove the global variable matching the key

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


