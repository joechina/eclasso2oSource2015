define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger,global) {
        var clazz = ko.observable();
        var classes = ko.observableArray();
        var student = ko.observable();
        var students = ko.observableArray();
        var exersizes = ko.observableArray();
        var exersize = ko.observable();
        var sections = ko.observableArray();
        var problem = ko.observable();
        var target = ko.observable();
        var answer = ko.observable();
        var ex=ko.observable();

        var vm = {
            exersizes: exersizes,
            exersize: exersize,
            ex:ex,
            classes: classes,
            students: students,
            student:student,
            activate: activate,
            router: router,
            quiztypename: global.quiztypename,
            displayanswer:displayanswer,
            back: back,
        };

        return vm;

        function activate() {

            //data.getClasses().then(function (data) {
            //    classes(data.results);
            //});
            student.subscribe(function(newValue) {
                exersizes.removeAll();
                for (var i = 0; i < newValue.Exersizes().length; i++) {
                    exersizes.push(newValue.Exersizes()[i].Exersize());
                }
            });

            ex.subscribe(function (newValue) {
                var eid = newValue.Id();

                data.getexersize(eid).then(function (data) {
                    exersize(data.results[0]);
                })
           });

            return data.getStudents().then(function (result) {
                students(result.results);

                $("#goback").css({ display: "none" });
                logger.log('new report activated');

            });

            //data.getallexersizes().then(function (data) {
            //    exersizes(data.results);
            //});

        }

        function back() {
            router.navigateBack();
        }

        function displayanswer() {
            
        }
    });