define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var errs = ko.observableArray();
        var username = ko.observable(null);
        var password = ko.observable();
        var password1 = ko.observable();
        var oldpassword = ko.observable();
        var userid = ko.observable();

        var vm = {
            activate: activate,
            userid: userid,
            username: username,
            oldpassword:oldpassword,
            password: password,
            password1: password1,
            savepwd: savepwd,
            back:back,
            router: router,
            errs: errs
        };

        b_shouter.subscribe(function (newValue) {
            back();
        }, this, "back_viewmodels/password");

        return vm;

        //#region Internal Methods
        function activate() {
            userid(localStorage.getItem("u"));
            if (data.user()) {
                username(data.user().Name());
            }
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

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
            else {
                alert(errs());
            }
        }

        function validate() {
            errs.removeAll();
 
            if (!password() || password().length === 0) {
                errs.push('请输入新密码 ');
            }
            if (!password1() || password1().length === 0) {
                errs.push('请输入确认的新密码 ');
            }
            if (password() && password1() && password() !== password1()) {
                errs.push('两次输入的新密码不一致 ');
            }
            if (oldpassword() == password()) {
                errs.push('请输入新密码 ');
            }
            if (password().length < 6) {
                errs.push('密码长度至少为 6 个字符');
            }

            var pwd = localStorage.getItem("p");
            if (oldpassword() !== pwd) {
                errs.push('当前密码错误');
            }
        }

        function back() {
            router.navigateBack();
        }
        //#endregion
    });