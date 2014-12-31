define(['plugins/router', 'knockout', 'data'],
    function (system, router, logger, ko, data, shell) {
        var username = ko.observable();
        var password = ko.observable();
        var rememberme = ko.observable();
        var login = {
            activate: activate,
            username: username,
            password: password,
            rememberme: rememberme,
            signin: signin
        };

        return login;

        //#region Internal Methods
        function activate() {
            shell.backbutton(false);
        }

        function signin() {
            data.signin(username(), password()).then(function (result) {
                router.navigate('/#');
            })
        }
        //#endregion
    });