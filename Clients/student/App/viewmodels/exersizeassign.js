define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var selectedstudents = ko.observableArray().extend({ rateLimit: 500, method: "notifyWhenChangesStop" });
        var allstudents = ko.observableArray().extend({ rateLimit: 500, method: "notifyWhenChangesStop" });
        var allexersizes = ko.observableArray();
        var allclasses = ko.observableArray();
        var selectedclass = ko.observable();
        var selectedexersizes = ko.observableArray();
        var studentlist = [];
        var teacherlist = [];
        var cur_classid = -1;

        var vm = {
            allexersizes: allexersizes,
            selectedexersizes: selectedexersizes,
            allclasses: allclasses,
            selectedclass: selectedclass,
            allstudents: allstudents,
            selectedstudents: selectedstudents,
            studentlist: studentlist,
            teacherlist: teacherlist,
            cur_classid: cur_classid,
            activate: activate,
            router: router,
            assign: assign,
            back: back,
            selectclass: ko.computed(function () {
                if (selectedclass()) {
                    if (studentlist.length == 0 || teacherlist.length == 0)
                        return false;
                    var clazz = selectedclass();
                    if (clazz.Id() == cur_classid)
                        return true;
                    cur_classid = clazz.Id();
                    var class_mbrs = new Array();
                    selectedclass().Users().forEach(function (user) {
                        if (teacherlist.indexOf(user.UserId()) < 0)
                            class_mbrs.push(user.UserId().toString());
                    });
                    selectedstudents(class_mbrs);
                    var class_students = new Array();
                    studentlist.forEach(function (student) {
                        if (class_mbrs.indexOf(student.Id().toString()) >= 0) {
                            class_students.push(student);
                        }
                    });
                    allstudents(class_students);
                    return true;
                }

                if (studentlist.length == 0 || teacherlist.length == 0 || cur_classid == -1)
                    return false;
                cur_classid = -1;
                selectedstudents([]);
                allstudents(studentlist);
                return false;
            }),
        };

        return vm;

        function activate() {
            selectedclass(null);
            cur_classid = -1;
            selectedstudents([]);
            data.getStudents().then(function (data) {
                if (studentlist.length > 0)
                    studentlist = [];
                studentlist = data.results;
                allstudents(studentlist);
            });

            data.getTeachers().then(function (data) {
                if (teacherlist.length > 0)
                    teacherlist = [];
                data.results.forEach(function (teacher) {
                    teacherlist.push(teacher.Id());
                });
            });

            data.getClasses().then(function (data) {
                allclasses(data.results);
            });

            data.getallexersizes().then(function (data) {
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
            var exer_ids = [];
            if (selectedexersizes()) {
                exer_ids.push(selectedexersizes().Id());
            }
            else {
                allexersizes().forEach(function (exer) {
                    exer_ids.push(exer.Id());
                });
            }

            var student_ids = [];
            if (selectedclass()) {
                student_ids = selectedstudents().sort(function (a, b) {
                    return a - b;
                });
            }
            else if (selectedstudents()) {
                student_ids.push(selectedstudents().Id());
            }
            else {
                allstudents().forEach(function (student) {
                    student_ids.push(student.Id());
                });
            }

            for (var i = 0; i < exer_ids.length; ++i) {
                for (var j = 0; j < student_ids.length; ++j) {
                    data.getuserexercise(student_ids[j], exer_ids[i]).then(function (result) {
                        if (result.results.length > 0) {//re-assigne?
                            var userExersize = results.results[0];
                        }
                        else {
                            var userExersize = data.create('UserExersize');
                            userExersize.UserId(student_ids[j]);
                            userExersize.ExersizeId(exer_ids[i]);
                            data.save(userExersize).then(function () {
                                logger.log('userExersize:' + student_ids[j] + '/' + exer_ids[i] );
                            }).fail(function (err) {
                                for (var i = 0; i < err.length; i++) {
                                    logger.log(err[i]);
                                }
                            });
                        }
                    });
                }
            }
        }
    });