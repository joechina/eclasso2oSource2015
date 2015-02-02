define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var setting = ko.observable();
        var settings = ko.observableArray();
        var login = {
            announcement: announcement,
            announcements: announcements,
            activate: activate,
            openmsg: openmsg,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)
            data.getannouncements().then(function (data) {
                announcements(data.results);
            });
            logger.log('announcements activated');
        }

        function openmsg(selected) {
            announcement(selected);
        }

        function backtolist() {
            announcement(undefined);
        }
        //#endregion
    });