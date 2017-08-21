<a name="1.2.0"></a>
# 1.2.0 (2017-08-21)

## Feature
- Add watch functionality

<a name="1.1.2"></a>
# 1.1.2 (2016-12-22)

## Bugfix
- Remove console log hook for rewriting to grunt log

<a name="1.1.1"></a>
# 1.1.1 (2016-11-22)

## Bugfix
- Fix failing tests after upgrade of ng-apimock

<a name="1.1.0"></a>
# 1.1.0 (2016-06-23)

## Improvements
- Split up grunt plugin and node plugin

## Breaking change
- The connect middleware function needs to be required from ng-apimock instead of grunt-ng-apimock

<a name="1.0.2"></a>
# 1.0.2 (2016-06-01)

## Bugfix
- Update README.md
- Fix matching mocks when none are provided
- Fix delete global variable from protractor

## Improvement
- Use protractor.promise instead of q in order to use the controlflow queue

<a name="1.0.1"></a>
# 1.0.1 (2016-05-30)

## Bugfix
- Fix save injection in protractor.mock.js

<a name="1.0.0"></a>
# 1.0.0 (2016-05-30)

## Feature
- Rewrite of to connect middleware
- Added support for default scenario option

<a name="0.1.5"></a>
# 0.1.5 (2016-03-02)

## Feature
- Request delay can now be configured as a configuration option 
(for async scenario switching sessionStorage is used and there can be delay between selecting a scenario and it being available.)

<a name="0.1.3"></a>
# 0.1.3 (2016-02-29)

## Bugfixes
- Remove excessive logging

<a name="0.1.2"></a>
# 0.1.2 (2016-02-16)

## Features
- Add global variables

<a name="0.1.1"></a>
# 0.1.1 (2016-01-04)

## Bugfixes
- Fix select scenario async behaviour
- Fix storage object that has escaped characters

<a name="0.0.8"></a>
# 0.0.8 (2015-12-29)

## Bugfixes
- Changing the Echo indicator for a post does not work #11
- Expressions that are regexes are not updated when changing the scenario #12

<a name="0.0.7"></a>
# 0.0.7 (2015-11-26)

## Features
- Add default passThrough response to every mock
- Select passThrough as default option
- Debug for post requests
- Support to remove and reset mockModule
- Change scenario's during tests

<a name="0.0.6"></a>
# 0.0.6 (2015-11-13)

## Bugfixes
- Fix duplicate expression override local storage

<a name="0.0.5"></a>
# 0.0.5 (2015-10-21)

## Bugfixes
- Default passthroughs don't work with protractor #1

<a name="0.0.4"></a>
# 0.0.4 (2015-10-13)

## Features
- Added support for default passThrough expressions

<a name="0.0.3"></a>
# 0.0.3 (2015-10-06)

## Features
- Added protractor.mock 
- Updated documentation and example
- Added tests

<a name="0.0.2"></a>
# 0.0.2 (2015-10-01)

## Features
- Added mocking web interface
- Added angular mock module