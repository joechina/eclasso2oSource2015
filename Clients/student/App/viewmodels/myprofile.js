define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var user = ko.observable();

        var me = {
            user: user,
            activate: activate,
            router: router,
            editprofile: editprofile,
            chgpwd:chgpwd,
            logout: logout,
        };

        b_shouter.subscribe(function (newValue) {
            back();
        }, this, "back_viewmodels/myprofile");

        return me;

        //#region Internal Methods
        function activate(id) {

            //get current sign in user
            user(data.user());

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

            logger.log('my profile page activated');
        }

        function editprofile() {
            router.navigate('/#editprofile');
        }

        function chgpwd() {
            router.navigate('/#password');
        }

        function logout() {
            data.setAccessToken('');
            router.navigate('/#signin');
        }

        function back() {
            router.navigateBack();
        }
        //#endregion
    });