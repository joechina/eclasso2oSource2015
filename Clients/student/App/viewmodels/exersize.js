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
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)
            if (!exersize()) {
                data.getexersizes().then(function (data) {
                    exersizes(data.results);
                });
            }

            $("#goback").css({ display: "none" });

            logger.log('exersizes activated');
        }

        function openexersize(selected) {
            exersize(selected);
        }

        function opendoneexersize(selected) {
            doneexersize(selected);
        }

        function backtolist() {
            exersize(undefined);
        }

        //#endregion
    });