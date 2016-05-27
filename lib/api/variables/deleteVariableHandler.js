(function () {
    'use strict';

    var MEDIA_TYPE_APPLICATION_JSON = 'application/json',
        DEFAULT_HEADERS = {'Content-Type': MEDIA_TYPE_APPLICATION_JSON};

    /**
     * Handles the delete variable request.
     *
     * @param request The http request.
     * @param response The http response.
     * @param config The configuration containing all the variables.
     */
    function handleRequest(request, response, config) {
        delete config.variables[new RegExp('/ngapimock/variables/(.*)').exec(request.url)[1]];
        response.writeHead(200, DEFAULT_HEADERS);
        response.end(JSON.stringify());
    }

    module.exports = {
        handleRequest: handleRequest
    }
})();