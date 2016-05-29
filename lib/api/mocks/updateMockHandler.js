(function () {
    'use strict';
    
    var MEDIA_TYPE_APPLICATION_JSON = 'application/json',
        DEFAULT_HEADERS = {'Content-Type': MEDIA_TYPE_APPLICATION_JSON};

    /**
     * Handles the update mock request.
     *
     * #1. Find the mock matching the request information.
     * #2. Set the selected scenario
     * #3. Send the response back
     *
     * @param request The http request.
     * @param response The http response.
     * @param config The configuration containing all the mock information.
     */
    function handleRequest(request, response, config) {
        var ngApimockId = request.headers.ngapimockid;
        request.on('data', function (rawData) {
            var data = JSON.parse(rawData);

            try {
                // #1
                var matchingMock = config.mocks.find(function (mock) {
                    return mock.name === data.name;
                });

                if (matchingMock) {
                    if(data.scenario !== undefined) { // select scenario
                        if (matchingMock.responses[data.scenario]) {
                            // #2
                            if(ngApimockId !== undefined) {
                                if(config.sessions[ngApimockId] === undefined) {
                                    config.sessions[ngApimockId] = {
                                        selections: {},
                                        variables: {}
                                    };
                                }
                                config.sessions[ngApimockId].selections[data.name] = data.scenario;
                            } else {
                                config.selections[data.name] = data.scenario;
                            }

                        } else {
                            throw new Error('No scenario matching name [' + data.scenario + '] found');
                        }
                    } else if(data.echo !== undefined) { // update echoing
                        matchingMock.echo = data.echo;
                    }
                } else {
                    throw new Error('No mock matching name [' + data.name + '] found');
                }
                // #3
                response.writeHead(200, DEFAULT_HEADERS);
                response.end();
            } catch (e) {
                // #3
                response.writeHead(409, DEFAULT_HEADERS);
                response.end(JSON.stringify(e, ["message"]));
            }
        });
    }

    module.exports = {
        handleRequest: handleRequest
    }
})();