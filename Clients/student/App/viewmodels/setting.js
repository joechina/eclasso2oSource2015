define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var Class = ko.observable();
        var Classes = ko.observableArray();
        var account = ko.observable();
       

        var me = {
            Class: Class,
            Classes:Classes,
            account:account,
            activate: activate,
            openClass: openClass,
            router: router,
            backtolist: backtolist,
           joinClass: joinClass
        };

        return me;

        //#region Internal Methods
        function activate(id) {
           
            data.getClasses().then(function (data) {
                Classes(data.results);
            });

            data.getCurrentUser().then(function (data) {
                account(data.result);
            });

            $("#goback").css({ display: "none" });

            logger.log('Classes activated');
        }

        function openClass(selected) {
            Class(selected);
        }

        function joinClass() {

        }

        function backtolist() {
            Class(undefined);
        }
        //#endregion
    });