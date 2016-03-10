define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var errs = ko.observableArray();
        var username = ko.observable();
        var password = ko.observable();
        var password1 = ko.observable();
        var rememberme = ko.observable();
        var userid = ko.observable();

        var vm = {
            activate: activate,
            userid:userid,
            username: username,
            password: password,
            password1: password1,
            signup: signup,
            router: router,
            back: back,
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

            if (errs().length == 0) {
                data.register(userid(), username(), password(), password1(), errs,'S').then(function () {
                    data.signin(userid(), password(), errs).then(function (result) {
                        localStorage.setItem("u", userid());
                        localStorage.setItem("p", password());
                        localStorage.setItem("lastsignin", (new Date()).getTime());

                        data.configureBreeze();
                        data.getCurrentUser().then(function () {
                            router.navigate('/#firstexp');
                        });
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
                errs.push('登录名不能为空');
            }
            var emailFormat = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            var mobileFormat = '/^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(18[0,5,6,7,8,9]\d{8}))$/';
            if (!emailFormat.test(userid())) {
                errs.push('登录名不是邮件地址');
            }
            if (!username() || username().length === 0) {
                errs.push('用户姓名不能为空');
            }
            if (!password() || password().length === 0) {
                errs.push('密码不能为空');
            }
            else if (password().length < 6) {
                errs.push('密码长度至少为 6 个字符');
            }
            if (!password1() || password1().length === 0) {
                errs.push('确认密码不能为空');
            }
            else if (password1().length < 6) {
                errs.push('确认密码长度至少为 6 个字符');
            }
            if (password() && password1() && password() !== password1()) {
                errs.push('密码不匹配');
            }
        }

        function aboutparrot() {
            router.navigate('/#tou');
        }

        //#endregion
    });