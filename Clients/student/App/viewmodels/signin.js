define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var errs = ko.observableArray();
        var username = ko.observable();
        var password = ko.observable();
        var rememberme = ko.observable();
        var login = {
            activate: activate,
            username: username,
            password: password,
            rememberme: rememberme,
            signin: signin,
            router: router,
            errs: errs,
        };

        return login;

        //#region Internal Methods
        function activate() {
            $("#goback").css({ display: "none" });
            logger.log('signin activated');
        }

        function signin() {
            validate();
            if (errs().length === 0) {
                data.signin(username(), password(),errs).then(function (result) {
                    router.navigate('/#');
                })
            }
        }

        function validate() {
            errs.removeAll();
            if (!username() || username().length === 0) {
                errs.push('missing UserName');
            }
            if (!password() || password().length === 0) {
                errs.push('missing Password');
            }
        }
        //#endregion
    });