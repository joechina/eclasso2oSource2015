define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var user = ko.observable();
        var user1 = ko.observable();

        var me = {
            user: user,
            activate: activate,
            router: router,
            save: save,
            cancel: cancel,
        };

        return me;

        //#region Internal Methods
        function activate(id) {

            //get current sign in user
            user(data.user());

            $("#goback").css({ display: "block" });

            logger.log('edit profile page activated');
        }

        function save() {

            var id = user().Id();

            //data.getuser(id).then(function (data) {
            //    user1(data.results);
            //}).fail(function (err) {
            //    alert(err.message);
            //});

            //user1().Name(user().Name());

            data.save(user()).then(function () {
                alert('user profile updated');
                router.navigateBack();
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });
        }

        function cancel() {
            router.navigateBack();
        }
        //#endregion
    });