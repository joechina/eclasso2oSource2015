define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {

        var me = {
            activate: activate,
            router: router,
        };

        return me;

        //#region Internal Methods
        function activate() {

            $("#goback").css({ display: "none" });

            logger.log('setting page activated');
        }

        function logout() {
            data.setAccessToken('');
            router.navigate('/#signin');


        }
        //#endregion
    });