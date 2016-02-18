require.config({
    paths: {
        'text': './../Scripts/text',
        'durandal': './../Scripts/durandal',
        'plugins': './../Scripts/durandal/plugins',
        'transitions': './../Scripts/durandal/transitions',
        'moment': './../Scripts/moment',
        'jqueryUI': './../Scripts/jquery-ui.min-1.11.2',       
        'logger': './logger',

    }
});

define('jquery', function () { return jQuery; });
define('knockout', function () { return ko; });
define('q', function () { return Q; });
define('breeze', function () { return breeze; });



define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'plugins/router'], boot);

function boot(app, viewLocator, system, router) {

    // Enable debug message to show in the console 
    system.debug(true);

    app.title = 'Parrot';

    app.configurePlugins({
        router: true,
        widget: true
    });
 
    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('viewmodels/shell', 'entrance');
     });
};