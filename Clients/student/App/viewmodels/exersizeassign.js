define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var selectedstudents = ko.observableArray();
        var allstudents = ko.observableArray();
        var allexersizes = ko.observableArray();
        var selectedexersizes = ko.observableArray();

        var vm = {
            allexersizes: allexersizes,
            selectedexersizes: selectedexersizes,
            allstudents: allstudents,
            selectedstudents: selectedstudents,
            activate: activate,
            router: router,
            assign: assign,
            back: back,
        };

        return vm;

        function activate() {

            data.getStudents().then(function (data) {
                allstudents(data.results);
            });

            data.getexersizes().then(function (data) {
                allexersizes(data.results);
            });

            $("#goback").css({ display: "none" });

            logger.log('exersize assignment activated');
            return true;
        }

        function back() {
            router.navigateBack();
        }

        function assign() {

        }
    });