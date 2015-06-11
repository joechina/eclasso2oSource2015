define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var errs = ko.observableArray();
        var username = ko.observable();
        var password = ko.observable();
        var password2 = ko.observable();
        var oldpassword = ko.observable();
        var userid = ko.observable();

        var vm = {
            activate: activate,
            userid: userid,
            username: username,
            oldpassword:oldpassword,
            password: password,
            password2: password2,
            savepwd:savepwd,
            router: router,
            errs: errs
        };

        return vm;

        //#region Internal Methods
        function activate() {
            username(data.user().Name());
            $("#goback").css({ display: "block" });
            logger.log('password page activated');
        }

        function savepwd() {
            validate();
            if (errs().length === 0) {
                data.changepassword(oldpassword(), password()).then(function () {
                    data.signin(userid(), password(), errs).then(function (result) {
                        router.navigate('/#');
                    });
                });
            }
        }

        function validate() {
            errs.removeAll();
 
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