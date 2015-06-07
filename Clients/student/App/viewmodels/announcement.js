define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var announcement = ko.observable();
        var announcements = ko.observableArray();
        var myannouncements = ko.observableArray();
        var msgDate = ko.observable();
        //var usermsg = ko.observableArray();

        var login = {
            announcement: announcement,
            announcements: announcements,
            activate: activate,
            openmsg: openmsg,
            router: router,
            backtolist: backtolist,
            newmsg: newmsg,
            msgDate:msgDate,
           // usermsg:usermsg
        };

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)

            /*
            var uid = data.user().Id(); // get current user id
            var usermsg = ko.observableArray();

            data.getuserannouncements(uid).then(function (data) {
                usermsg(data.results);
            });
            */

            data.getallannouncements().then(function (data) {
                announcements(data.results);
            });

            $("#goback").css({ display: "none" });
            logger.log('announcements activated');
        }

        function openmsg(selected) {
            announcement(selected);
            var date = announcement().CreateDate();
            msgDate = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
        }

        function backtolist() {
            announcement(undefined);            
        }

        function newmsg() {
            router.navigate('/#newmsg');
        }
        //#endregion
    });