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
            if (!autosignin()) {
                $("#goback").css({ display: "none" });
                logger.log('signin activated');
            }
        }

        function signin(u, p) {
            if (!u) {
                u = username();
                p = password();
            }
            validate();
            if (errs().length === 0) {

                data.signin(username(), password(), errs).then(function (result) {
                        localStorage.setItem("u", username());
                        localStorage.setItem("p", password());
                        localStorage.setItem("lastsignin", (new Date()).getTime());

                        if (password() == "parisjetaime") { //first sig in and redirect to change password
                            router.navigate('/#password');
                        }
                        else {
                            router.navigate('/#');
                        }
                    })
                
            }
        }

        function autosignin() {
            var lastsignin = localStorage.getItem("lastsignin");
            if (lastsignin) {
                var now = new Date();
                var dif = (now.getTime() - lastsignin) / 1000 / 60 / 60 / 24;
                //Valid for 14 days
                if (dif < 14) {
                    var user = localStorage.getItem("u", username());
                    var pwd = localStorage.getItem("p", password());
                    username(user);
                    password(pwd);
                    signin(user, pwd);
                }
            }
            return false;
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