define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazzes = ko.observableArray();
        var clazz = ko.observable();
        var students = ko.observableArray();
        var teachers = ko.observableArray();
        var selectedTeachers = ko.observableArray();
        var selectedStudents = ko.observableArray();
        var showclazz = ko.observable(false);
        var vm = {
            clazzes: clazzes,
            clazz:clazz,
            students: students,
            teachers:teachers,
            activate: activate,
            openclazz: openclazz,
            delclazz: delclazz,
            editclazz:editclazz,
            router: router,
            backtolist: backtolist,
            newclazz: newclazz,
            showclazz: showclazz,
            selectedTeachers: selectedTeachers,
            selectedStudents: selectedStudents,
            router: router,
            save: save,
        };

        var self = vm;
        return vm;

        //#region Internal Methods
        function activate(id) {
            data.getClasses().then(function (data) {
                clazzes(data.results);
            });

            $("#goback").css({ display: "block" });
            logger.log('clazzes activated');
        }

        function openclazz(selected) {
            clazz(selected);
            $("#goback").css({ display: "block" });
            return true;
        }

        function newclazz() {
            router.navigate('/#newclazz');
        }

        function editclazz() {
            selectedTeachers([]);
            selectedStudents([]);
            var class_mbrs = new Array();
            clazz().Users().forEach(function (user) {
                class_mbrs.push(user.UserId());
            });
            data.getTeachers().then(function (data) {
                teachers(data.results);
                teachers().forEach(function (user) {
                    if (class_mbrs.indexOf(user.Id()) >= 0)
                        selectedTeachers.push(user.Id().toString());
                });
            });

            data.getStudents().then(function (data) {
                students(data.results);
                students().forEach(function (user) {
                    if (class_mbrs.indexOf(user.Id()) >= 0)
                        selectedStudents.push(user.Id().toString());
                });
            });


            showclazz(true);
        }

        function delclazz() {
            var class_id = clazz().Id();
        }

        function save() {
            var user_list = selectedStudents();
            /*
            clazz().Users(user_list);
            data.save(clazz()).then(function () {
                logger.log('save class');

            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    logger.log(err[i]);
                }
            });
            var r = user_list[0];*/
            backtolist();
        }

        function backtolist() {
            showclazz(false);
            clazz(null);
            //router.navigateBack();
        }

        //#endregion
    });