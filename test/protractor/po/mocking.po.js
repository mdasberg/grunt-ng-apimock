'use strict';

/**
 * Mocking page object.
 * @constructor
 */
var MockingPO = function () {
};

MockingPO.prototype = Object.create({}, {
    partials: {
       get: function() {
           return element(by.name('partials/.*'));
       }
    },
    api: {
        get: function() {
            return element(by.name('/online/rest/some/api'));
        }
    },
    clear: {
        value: function() {
            return element(by.buttonText('Clear all mocks')).click();
        }
        
    }
});

module.exports = MockingPO;