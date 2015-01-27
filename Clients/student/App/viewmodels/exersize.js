define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var exersize = ko.observable();
        var exersizes = ko.observableArray();
        var login = {
            exersize: exersize,
            exersizes: exersizes,
            activate: activate,
            openexersize: openexersize,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)
            data.getexersizes().then(function (data) {
                exersizes(data.results);
            });
            logger.log('exersizes activated');
        }

        function openexersize(selected) {
            exersize(selected);
        }

        function backtolist() {
            exersize(undefined);
        }
        //#endregion
    });