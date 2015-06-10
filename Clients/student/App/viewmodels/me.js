define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var Class = ko.observable();
        var Classes = ko.observableArray();
        var myClasses = ko.observableArray();
        var user = ko.observable();
       
        var me = {
            Classes: Classes,
            user: user,
            myprofile:myprofile,
            activate: activate,
            myclazz: myclazz,
            aboutparrot: aboutparrot,
            feedback:feedback,
            router: router,
            logout:logout,
        };

        return me;

        //#region Internal Methods
        function activate(id) {
           
            data.getUserClasses(data.user().Id()).then(function (data) {
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

            //get current sign in user
            user(data.user());

            $("#goback").css({ display: "none" });

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

        function aboutparrot() {
            //router.navigate('/#tou');
        }
        //#endregion
    });