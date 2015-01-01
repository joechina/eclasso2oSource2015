define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var username = ko.observable();
        var password = ko.observable();
        var rememberme = ko.observable();
        var login = {
            activate: activate,
            username: username,
            password: password,
            rememberme: rememberme,
            signin: signin,
            router: router
        };

        return login;

        //#region Internal Methods
        function activate() {
            logger.log('home activated');
        }

        function signin() {
            data.signin(username(), password()).then(function (result) {
                router.navigate('/#');
            })
        }
        //#endregion
    });