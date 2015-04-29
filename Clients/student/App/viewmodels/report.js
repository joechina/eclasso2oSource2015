define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger,global) {
        var clazz = ko.observable();
        var classes = ko.observableArray();
        var student = ko.observable();
        var students = ko.observableArray();
        var exersizes = ko.observableArray();
        var exersize = ko.observable();
        var sections = ko.observableArray();
        var quiz = ko.observable();
        var target = ko.observable();
        var userAnswer = ko.observable();

        var vm = {
            exersizes: exersizes,
            exersize:exersize,
            classes: classes,
            students: students,
            student:student,
            activate: activate,
            router: router,
            quiztypename: global.quiztypename,
            back: back,
            quiz:quiz,
            displayanswer: displayanswer

        };

        return vm;

        function activate() {

            data.getClasses().then(function (data) {
                classes(data.results);
            });

            data.getStudents().then(function (data) {
                students(data.results);
            });

            data.getexersizes().then(function (data) {
                exersizes(data.results);
            });

            $("#goback").css({ display: "none" });

            logger.log('new report activated');
            return true;
        }

        function back() {
            router.navigateBack();
        }

        function displayanswer() {
            var uid = student().Id();
            //var qid = quiz().Id();
            data.getUserAnswer(uid, 52).then(function (data) {
                userAnswer(data.results);
            });
        }
    });