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
           return element(by.name('partials/.*$$GET'));
       }
    },
    apiGET: {
        get: function() {
            return element(by.name('online/rest/some/api/.*/and/.*$$GET'));
        }
    },
    apiPOST: {
        get: function() {
            return element(by.name('online/rest/some/api/.*/and/.*$$POST'));
        }
    },
    echoPOST: {
        get: function() {
            return element(by.model('echo'));
        }
    },
    clear: {
        value: function() {
            return element(by.buttonText('Clear all mocks')).click();
        }
        
    }
});

module.exports = MockingPO;