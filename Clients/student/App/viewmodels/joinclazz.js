define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var userclazzes = ko.observableArray();
        var selectedclazzes = ko.observableArray();
        var clazzes = ko.observableArray();
        var classes_list = ko.observableArray();
        var check_newclass = ko.observable();
        var auto_approve = [];
        var assigned_exersizes = [];
        var new_exersizes = [];
        //var students = ko.observableArray();
        //var teachers = ko.observableArray();

        var vm = {
            clazzes: clazzes,
            userclazzes: userclazzes,
            classes_list: classes_list,
            selectedclazzes: selectedclazzes,
            check_newclass: check_newclass,
            auto_approve: auto_approve,
            new_exersizes: new_exersizes,
            assigned_exersizes: assigned_exersizes,
            activate: activate,
            quitclazz: quitclazz,
            join: join,
            router: router,
            is_joinable: is_joinable,
            is_enabled: is_enabled,
            add_exercises: ko.computed(function () {
                if (check_newclass() == 1 && selectedclazzes().length == classes_list().length) {
                    if (new_exersizes.length) {
                        new_exersizes.forEach(function (exercise) {
                            data.getManager().attachEntity(exercise, exercise.entityAspect.entityState);
                        });
                        data.getManager().saveChanges().then(function () {
                            new_exersizes.forEach(function (exercise) {
                                assigned_exersizes.push(exercise.ExersizeId());
                            });
                        });
                        new_exersizes = [];
                    }
                    check_newclass(0);
                }
            }),
        };

        return vm;

        //#region Internal Methods
        function makeCallBack(index) {
            return function (teacher) {
                if (teacher.results.length > 0) {
                    clazzes()[index].teacher(teacher.results[0].Name());
                }
            };
        }
        function activate() {
            var uid = data.user().Id();
            check_newclass(0);
            data.getClasses().then(function (clazz_result) {
                auto_approve = [];
                clazzes.removeAll();
                clazz_result.results.forEach(function (cur_clazz) {
                    cur_clazz.teacher = ko.observable();
                    var callback_fun = makeCallBack(clazzes().length)
                    if (cur_clazz.autoApproved())
                        auto_approve.push(cur_clazz.Id());
                    clazzes.push(cur_clazz);
                    var tid = cur_clazz.TeacherId();
                    data.getuser(tid).then(callback_fun);
                });

                data.getUserClasses(uid).then(function (result) {
                    userclazzes(result.results);
                    selectedclazzes([]);
                    classes_list([]);
                    result.results.forEach(function (my_clazz) {
                        var clazz_id = my_clazz.ClassId().toString();
                        selectedclazzes.push(clazz_id);
                        classes_list.push(clazz_id);
                    });
                });
                data.getuserexersizes(uid).then(function (result) {
                    if (result.results && result.results.length) {
                        result.results.forEach(function (exersize) {
                            assigned_exersizes.push(exersize.ExersizeId());
                        });
                    }
                });
            });

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

            logger.log('my clazzes activated');
        }

        function quitclazz(selected) {
            var uid = data.user().Id();
            var cid = selected().Id();

            // TODO: delete this record from UserClasses table
        }

        function is_joinable() {
            return selectedclazzes().length > classes_list().length;
        }

        function join() {
            var uid = data.user().Id();
            var need_commit = false;
            check_newclass(1);
            selectedclazzes().forEach(function (id) {
                if (classes_list().indexOf(id) < 0) {
                    var cid = parseInt(id, 10);
                    var userclass = data.create("UserClass");
                    userclass.UserId(uid);
                    userclass.ClassId(cid);
                    if (auto_approve.indexOf(cid) >= 0) {
                        check_newclass(check_newclass() + 1);
                        userclass.Approved('true');
                        data.getclassexersizes(cid).then(function (exersizes) {
                            exersizes.results.forEach(function (exersize) {
                                eid = exersize.ExersizeId();
                                if (assigned_exersizes.indexOf(eid) < 0) {
                                    var userexersize = data.create("UserExersize");
                                    userexersize.UserId(uid);
                                    userexersize.ExersizeId(exersize.ExersizeId());
                                    new_exersizes.push(userexersizes);
                                }
                            });
                            check_newclass(check_newclass() - 1);
                        }).fail(function (err) {
                            check_newclass(check_newclass() - 1);
                        });
                    }
                    else
                        userclass.Approved('false');
                    data.getManager().attachEntity(userclass, userclass.entityAspect.entityState);
                    need_commit = true;
                }
            });

            if (need_commit) {
                data.getManager().saveChanges().then(function () {
                    alert('课程已更新结束');
                    classes_list(selectedclazzes());
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        logger.log(err[i]);
                    }
                });
            }
        }

        function is_enabled(id) {
            var index = classes_list().indexOf(id.toString());
            return index < 0;
        }
        //#endregion
    });