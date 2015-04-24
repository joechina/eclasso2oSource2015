define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var exersize = ko.observable();
        var exersizes = ko.observableArray();
        var section = ko.observable();
        var sections = ko.observableArray();

        var login = {
            section: section,
            sections: sections,
            activate: activate,
            openexersize: openexersize,
            opensection:opensection,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)
            if (!section()) {
                data.getsections().then(function (data) {
                    sections(data.results);
                });

            }

            $("#goback").css({ display: "none" });

            logger.log('exersizes activated');
        }

        function openexersize(selected) {
            exersize(selected);
        }

        function opensection(selected) {
            section(selected);
        }
        function backtolist() {
            section(undefined);
        }

        
        //#endregion
    });