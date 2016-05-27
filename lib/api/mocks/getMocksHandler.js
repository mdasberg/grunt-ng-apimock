(function () {
    'use strict';
    
    var MEDIA_TYPE_APPLICATION_JSON = 'application/json',
        DEFAULT_HEADERS = {'Content-Type': MEDIA_TYPE_APPLICATION_JSON};

    /**
     * Handles the get mocks request.
     *
     * @param request The http request.
     * @param response The http response.
     * @param config The configuration containing all the mock information.
     */
    function handleRequest(response, config) {
        response.writeHead(200, DEFAULT_HEADERS);
        response.end(JSON.stringify({
                mocks: config.mocks,
                selections: config.selections
            }
        ));
    }

    module.exports = {
        handleRequest: handleRequest
    }
})();