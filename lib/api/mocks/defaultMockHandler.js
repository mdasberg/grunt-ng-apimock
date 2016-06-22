(function () {
    'use strict';

    var MEDIA_TYPE_APPLICATION_JSON = 'application/json',
        DEFAULT_HEADERS = {'Content-Type': MEDIA_TYPE_APPLICATION_JSON};

    /**
     * Handles the reset mocks to default request.
     *
     * @param request The http request.
     * @param response The http response.
     * @param config The configuration containing all the mock information.
     */
    function handleRequest(request, response, config) {
        var ngApimockId = request.headers.ngapimockid,
            selections;

        if (ngApimockId !== undefined) {
            var session = config.sessions[ngApimockId];
            if (session === undefined) { // if there is no session selections present, add the defaults
                config.sessions[ngApimockId] = {
                    selections: JSON.parse(JSON.stringify(config.defaults)),
                    variables: {}
                };
            }
            selections = config.sessions[ngApimockId].selections = JSON.parse(JSON.stringify(config.defaults));
        } else {
            selections = config.selections = JSON.parse(JSON.stringify(config.defaults));
        }

        response.writeHead(200, DEFAULT_HEADERS);
        response.end(JSON.stringify({
                mocks: config.mocks,
                selections: selections
            }
        ));
    }

    module.exports = {
        handleRequest: handleRequest
    }
})();