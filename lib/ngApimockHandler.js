(function () {
    'use strict';

    var MEDIA_TYPE_APPLICATION_JSON = 'application/json',
        DEFAULT_HEADERS = {'Content-Type': MEDIA_TYPE_APPLICATION_JSON};

    /**
     * Update the response data with the globally available variables.
     * @param data The data.
     * @return updatedData The updated data.
     */
    function updateData(data, variables) {
        var json = JSON.stringify(data);
        Object.keys(variables).forEach(function (key) {
            if (variables.hasOwnProperty(key)) {
                json = json.replace(new RegExp("%%" + key + "%%", "g"), variables[key]);
            }
        });
        return JSON.parse(json);
    }

    /**
     * Handle the request.
     *
     * #1. Find the mock matching the request information.
     * #2. Get the selected scenario
     * #3. Send the response back
     *
     * @param request The http request.
     * @param response The http response.
     * @param next The next middleware.
     * @param config The configuration containing all the mocking information.
     */
    function handleRequest(request, response, next, config) {
        // #1
        var matchingMock = config.mocks.find(function (mock) {
            var expressionMatches = new RegExp(mock.expression).exec(request.url) !== null;
            var methodMatches = mock.method === request.method;
            return expressionMatches && methodMatches;
        });

        if (matchingMock) {
            // #2
            var mockResponse = matchingMock.responses[(config.selections[matchingMock.name])];
            if (mockResponse) {
                // #3
                var statusCode = mockResponse.status || 200,
                    reasonPhrase = mockResponse.headers || DEFAULT_HEADERS,
                    chunk = JSON.stringify(mockResponse.data ? updateData(mockResponse.data, config.variables) : (matchingMock.isArray ? [] : {}));

                response.writeHead(statusCode, reasonPhrase);
                response.end(chunk);
            } else {
                next();
            }
        } else {
            next();
        }
    }

    module.exports = {
        handleRequest: handleRequest
    }
})();