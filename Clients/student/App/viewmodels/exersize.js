define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var exersize = ko.observable();
        var exersizes = ko.observableArray();

        var doneexersize = ko.observable();
        var doneexersizes = ko.observableArray();

        var login = {
            exersize: exersize,
            exersizes: exersizes,
            activate: activate,
            openexersize: openexersize,
            opendoneexersize:opendoneexersize,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(uid) {

            if (!exersize()) {
                data.getuserexercises(uid).then(function (data) {
                    exersizes(data.results);
                });
            }

            $("#goback").css({ display: "none" });

            logger.log('exersizes activated');
        }

        function openexersize(selected) {
            var id = selected.ExersizeId();
            data.getexersize(id).then(function (data) {
                exersize(data.results[0]);
            });
        }

        function opendoneexersize(selected) {
            doneexersize(selected);
        }

        function backtolist() {
            exersize(undefined);
        }

        //#endregion
    });