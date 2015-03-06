define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var announcement = ko.observable();
        var announcements = ko.observableArray();
        var myannouncements = ko.observableArray();

        var login = {
            announcement: announcement,
            announcements: announcements,
            activate: activate,
            openmsg: openmsg,
            router: router,
            backtolist: backtolist,
            newmsg:newmsg
        };

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)

            var uid = data.user().UserName;
            alert(uid);

            data.getuserannouncements(uid).then(function (data) {
                announcements(data.results);
            });
                  

            
            $("#goback").css({ display: "none" });
            logger.log('announcements activated');
        }

        function openmsg(selected) {
            announcement(selected);
            $("#goback").css({ display: "block" });
        }

        function backtolist() {
            announcement(undefined);
            router.navigateBack();
            $("#goback").css({ display: "none" });
        }

        function newmsg() {
            router.navigate('/#newmsg');
        }
        //#endregion
    });