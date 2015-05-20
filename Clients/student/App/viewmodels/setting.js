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
            router: router,
            logout:logout,
        };

        return me;

        //#region Internal Methods
        function activate(id) {
           
            data.getClasses().then(function (data) {
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

            logger.log('setting page activated');
        }

        function myprofile() {
            router.navigate('/#myprofile');
        }

        function logout() {
            data.setAccessToken('');
            router.navigate('/#signin');
            
            
        }
        //#endregion
    });