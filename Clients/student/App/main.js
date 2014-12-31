require.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions',
        'moment': '../js/moment',
        'jqueryUI': '../js/jquery-ui.min-1.11.1',
        'datacontext': 'services/dummydatacontext'
    }
});

define('jquery', function () { return jQuery; });
define('knockout', function () { return ko; });
define('q', function () { return Q; });
define('breeze', function () { return breeze; });


define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'plugins/router', 'services/logger'], boot);

function boot(app, viewLocator, system, router, logger) {

    // Enable debug message to show in the console 
    system.debug(true);

    app.title = 'eClassO2O Student';

    app.configurePlugins({
        router: true
    });

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('viewmodels/shell', 'entrance');
    });
};