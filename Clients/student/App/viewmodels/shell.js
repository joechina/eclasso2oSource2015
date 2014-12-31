define(['durandal/app', 'plugins/router', 'knockout', 'data', 'global'],
    function (app, router, ko, data, global) {
        var vm = {
            app:app,
            activate: activate,
            canActivate:canActivate,
            router: router,
        };

        function canActivate() {
            if (!data.getAccessToken()) {
                router.navigate('/#signin');
                return false;
            }
            else {
                datacontext.configureBreeze();
                return true;
            }
        }

        function activate() {
            return boot();
        }

        return vm;
    });