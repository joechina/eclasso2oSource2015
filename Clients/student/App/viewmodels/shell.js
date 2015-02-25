define(['durandal/app', 'plugins/router', 'knockout', 'global', 'logger'],
    function (app, router, ko, global,logger) {
        var vm = {
            app:app,
            activate: activate,
            router: router,
        };
        return vm;

        function activate() {
            return boot();
        }

        function boot() {
            logger.log('started', '','');
            router.on('router:route:not-found', function (fragment) {
                logger.logError('No Route Found', fragment, true);
            });

            var routes = global.routes;

            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }
        
    });