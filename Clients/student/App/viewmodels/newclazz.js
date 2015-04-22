define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazz = ko.observable();
        var teachers = ko.observableArray();
        var students = ko.observableArray();
        var teacher = ko.observable();
        var selectedStudents = ko.observableArray();
        var startDate = ko.observable();
        var endDate = ko.observable();

        var vm = {
            clazz: clazz,
            teachers: teachers,
            teacher: teacher,
            students: students,
            selectedStudents: selectedStudents,
            startDate: startDate,
            endDate:endDate,
            activate: activate,
            router: router,
            back: back,
            save: save,
        };

        return vm;

        function activate() {
            vm.clazz(data.create('Class'));
            var today = new Date();
            startDate(today);
            endDate(today.Clone());
            endDate.setMonth(endDate.getMonth() + 1);

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
            data.save(vm.clazz).then(function () {
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

