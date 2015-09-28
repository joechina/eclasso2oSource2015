define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var user = ko.observable();

        var me = {
            user: user,
            activate: activate,
            router: router,
            save: save,
            back: back,
        };

        b_shouter.subscribe(function (newValue) {
            back();
        }, this, "back_viewmodels/editprofile");

        return me;

        //#region Internal Methods
        function activate(id) {

            //get current sign in user
            user(data.user());

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

            logger.log('edit profile page activated');
        }

        function save() {
            data.save(user()).then(function () {
                alert('个人资料已保存');
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });

            back();
        }

        function back() {
            router.navigate('/#myprofile');
        }
        //#endregion
    });