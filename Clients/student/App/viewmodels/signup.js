define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var errs = ko.observableArray();
        var username = ko.observable();
        var password = ko.observable();
        var password2 = ko.observable();
        var rememberme = ko.observable();
        var userid = ko.observable();

        var vm = {
            activate: activate,
            userid:userid,
            username: username,
            password: password,
            password2: password2,
            signup: signup,
            router: router,
            backtolist: backtolist,
            errs: errs
        };

        b_shouter.subscribe(function (newValue) {
            back();
        }, this, "back_viewmodels/signup");

        return vm;

        //#region Internal Methods
        function activate() {
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });
            logger.log('signup activated');
        }

        function signup() {
            validate();
            if (errs().length === 0) {
                data.register(userid(), username(), password(), password2(), errs,'S').then(function () {
                    data.signin(userid(), password(), errs).then(function (result) {
                        router.navigate('/#');
                    });
                });
            }
        }

        function back() {
            router.navigate('/#signin');
        }

        function validate() {
            errs.removeAll();
            if (!userid() || userid().length === 0) {
                errs.push('missing UserName');
            }
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