define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var announcement = ko.observable();
        var announcements = ko.observableArray();
        var login = {
            clazz: clazz,
            classes: classes,
            activate: activate,
            openclass: openclass,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)
            data.classes().then(function (data) {
                classes(data.results);
            });
            logger.log('classes activated');
        }

        function openclass(selected) {
            clazz(selected);
        }

        function backtolist() {
            clazz(undefined);
        }
        //#endregion
    });