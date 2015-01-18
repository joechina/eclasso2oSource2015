define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var errs = ko.observableArray();
        var username = ko.observable();
        var password = ko.observable();
        var password2 = ko.observable();
        var rememberme = ko.observable();
        var vm = {
            activate: activate,
            username: username,
            password: password,
            password2: password2,
            signup: signup,
            router: router,
            errs: errs
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('home activated');
        }

        function signup() {
            validate();
            if (errs().length === 0) {
                data.register(username(), password(), password2(), errs).then(function () {
                    data.signin(username(), password(), errs).then(function (result) {
                        router.navigate('/#');
                    });
                });
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
            if (!password2() || password2().length === 0) {
                errs.push('missing Confirm Password');
            }
            if (password() && password2() && password() !== password2()) {
                errs.push('Passwords do not match');
            }
        }
        //#endregion
    });