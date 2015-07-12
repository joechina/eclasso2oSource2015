define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazz = ko.observable();
        var teachers = ko.observableArray();
        var students = ko.observableArray();
        var teacher = ko.observable();
        var selectedStudents = ko.observableArray();

        var vm = {
            clazz: clazz,
            teacher: teacher,
            teachers:teachers,
            students: students,
            selectedStudents: selectedStudents,
            activate: activate,
            router: router,
            back: back,
            save: save,
        };

        return vm;

        function activate() {
            clazz(data.create('Class'));

            clazz().Start(new Date());
            clazz().End(new Date());
            clazz().End().setMonth(clazz().End().getMonth() + 1);

            data.getTeachers().then(function (data) {
                teachers(data.results);
            })

            data.getStudents().then(function (data) {
                students(data.results);
            })

            $("#goback").css({ display: "none" });

            logger.log('new clazz activated');
            return true;
        }

        function back() {
            router.navigateBack();
        }

        function save() {
            var tid = teacher().Id();
            data.save(clazz()).then(function () {
                alert('Clazz created');
                router.navigateBack();
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });

        }

    });

