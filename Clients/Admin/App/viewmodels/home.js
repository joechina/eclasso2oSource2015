define(['durandal/system', 'plugins/router', 'logger', 'knockout', 'global'],
    function (system, router, logger, ko, global) {
        var server = global.data;
        var home = {
            activate: activate,
            router: router,
            canActivate: canActivate,
        };

        return home;

        //#region Internal Methods
        function canActivate() {
            if (!server.getAccessToken()) {
                router.navigate('/#signin');
                return false;
            }
            else {
                server.configureBreeze();
                server.getCurrentUser();
                return true;
            }
        }

        function activate() {
            logger.log('Home View Activated', null, 'Home', false);
            //$("#shortcut").css({ display: "block" }); //display shortcut menu at top right

            server.getCurrentUser().then(function () {

                router.navigate('/#msgEx');

                server.user().lastSignin(new Date());
                server.save(server.user()).then(function () {
                    logger.log('last sign in ');
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        alert(err[i]);
                        logger.log(err[i]);
                    }
                });
            })
        }
        //#endregion
    });