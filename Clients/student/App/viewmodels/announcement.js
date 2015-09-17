define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var announcement = ko.observable();
        var announcements = ko.observableArray();
        var myannouncements = ko.observableArray();
        var previous_title = ko.observable();

        var login = {
            announcement: announcement,
            announcements: announcements,
            activate: activate,
            openmsg: openmsg,
            router: router,
            previous_title : previous_title,
            backtolist: backtolist,
            newmsg: newmsg,
           // usermsg:usermsg
        };

        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload announcement');
        }, this, "refresh_viewmodels/announcement");

        b_shouter.subscribe(function (newValue) {
            backtolist();
        }, this, "back_viewmodels/announcement");

        return login;

        //#region Internal Methods
        function activate() {
            //var questionid = parseInt(id)
            //if (questionid > 0)

            /*
            var uid = data.user().Id(); // get current user id
            var usermsg = ko.observableArray();

            data.getuserannouncements(uid).then(function (data) {
                usermsg(data.results);
            });
            */

            if (announcement()) {
                $("#main_title").css({ float: "left", position: "relative" });

                $("#goback").css({ display: "block" });
                $("#refresh").css({ display: "none" });
            } else {
                $("#main_title").css({ float: "center", position: "absolute" });
                $("#goback").css({ display: "none" });
                $("#refresh").css({ display: "inline" });
            }

            announcements.removeAll();
            data.getsentannouncements().then(function (data) {
                announcements(data.results);
            });

            logger.log('announcements activated');
        }

        function openmsg(selected) {
            announcement(selected);
            
            //
            //var le = document.getElementById("goback").currentStyle.lineHeight;
            //$("#goback")[0].currentStyle.lineHeight;

            $("#main_title").css({float: "left", position:"relative"});

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });
        }

        function backtolist() {
            announcement(undefined);
            $("#main_title").css({ float: "center", position: "absolute" });

            $("#goback").css({ display: "none" });

            $("#refresh").css({ display: "inline" });
        }

        function newmsg() {
            router.navigate('/#newmsg');
        }
        //#endregion
    });