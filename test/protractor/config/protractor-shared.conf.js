exports.config = {
    allScriptsTimeout: 11000,

    baseUrl: 'http://localhost:9900/',

    framework: 'jasmine2',

    params: {
        environment: 'BUILD'
    },

    onPrepare: function() {
    },
    onCleanUp: function () {
    },
    beforeLaunch: function() {
    },
    afterLaunch: function () {
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 40000
    }
};