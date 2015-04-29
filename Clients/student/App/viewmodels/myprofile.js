define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var user = ko.observable();

        var me = {
            user: user,
            activate: activate,
            router: router,
            editid: editid,
            editname: editname,
            editemail: editemail,
            editmobile:editmobile,
            logout: logout,
        };

        return me;

        //#region Internal Methods
        function activate(id) {

            //get current sign in user
            user(data.user());

            $("#goback").css({ display: "none" });

            logger.log('Classes activated');
        }

        function editid() {
            router.navigate('/#editid')
        }

        function editname() {
            router.navigate('/#editname')
        }

        function editemail() {
            router.navigate('/#editemail')
        }

        function editmobile() {
            router.navigate('/#editmobile')
        }

        function logout() {
            router.navigate('/#signin');
            data.setAccessToken(undefined);
        }
        //#endregion
    });