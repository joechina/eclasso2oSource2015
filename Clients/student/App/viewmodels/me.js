define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var Class = ko.observable();
        var Classes = ko.observableArray();
        var myClasses = ko.observableArray();
        var user = ko.observable();
        var totalex = ko.observable();
       
        var me = {
            Classes: Classes,
            user: user,
            myprofile: myprofile,
            totalex:totalex,
            activate: activate,
            myclazz: myclazz,
            myreport:myreport,
            aboutparrot: aboutparrot,
            feedback:feedback,
            router: router,
            logout:logout,
        };
        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload me');
        }, this, "refresh_viewmodels/me");

        return me;

        //#region Internal Methods
        function activate() {
            //get current sign in user
            user(data.user());

            data.getUserClasses(user().Id()).then(function (data) {
                Classes(data.results);
            });

            /*
            for (i=0; i< Classes().length;i++) {
                var c = Classes()[0];
                var uid = data.user().Id();
                for (j = 0; j < c().Users().length; j++) {
                    var cuid = c().Users()[0].UserId;
                    if (cuid == uid) {
                        myClasses.push(c);
                    }
                }
            }
            */

            // get submit exercises number
            data.getuserexersizes_status(user().Id(), true).then(function (data) {
                totalex(data.results.length);
            });

            $("#goback").css({ display: "none" });
            $("#refresh").css({ display: "inline" });

            logger.log('me page activated');
        }

        function myprofile() {
            router.navigate('/#myprofile');
        }

        function myclazz() {
            router.navigate('/#myclazz');
        }

        function logout() {
            data.setAccessToken('');
            router.navigate('/#signin');
        }

        function feedback() {
            router.navigate('/#feedback');
        }

        function myreport() {
            router.navigate('/#myreport');
        }

        function aboutparrot() {
            //router.navigate('/#tou');
        }
        //#endregion
    });