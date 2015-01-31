define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var Class = ko.observable();
        var Classes = ko.observableArray();
        var login = {
            Class: Class,
            Classes: Classes,
            activate: activate,
            openClass: openClass,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(id) {

            data.getClasses().then(function (data) {
                Classes(data.results);
            });
            logger.log('Classes activated');
        }

        function openClass(selected) {
            Class(selected);
        }

        function backtolist() {
            Class(undefined);
        }
        //#endregion
    });