define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var userclazzes = ko.observableArray();
        var selectedclazzes = ko.observableArray();
        var clazzes = ko.observableArray();
        var classes_list = ko.observableArray();
        //var students = ko.observableArray();
        //var teachers = ko.observableArray();

        var vm = {
            clazzes: clazzes,
            userclazzes: userclazzes,
            classes_list: classes_list,
            selectedclazzes: selectedclazzes,
            activate: activate,
            quitclazz: quitclazz,
            join:join,
            router: router,
            is_joinable: is_joinable,
            is_enabled: is_enabled,
        };

        return vm;

        //#region Internal Methods
        function makeCallBack(index){
            return function (teacher) {
                if (teacher.results.length > 0) {
                    clazzes()[index].teacher(teacher.results[0].Name());
                }
            };
        }
        function activate() {
            var uid = data.user().Id();
            data.getClasses().then(function (clazz_result) {
                clazzes.removeAll();
                clazz_result.results.forEach(function (cur_clazz) {
                    cur_clazz.teacher = ko.observable();
                    var callback_fun = makeCallBack(clazzes().length)
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
            selectedclazzes().forEach(function (id) {
                if (classes_list().indexOf(id) < 0) {
                    var cid = parseInt(id, 10);
                    var userclass = data.create("UserClass");
                    userclass.UserId(uid);
                    userclass.ClassId(cid);
                    userclass.Approved('true');
                    data.getManager().attachEntity(userclass, userclass.entityAspect.entityState);
                    need_commit = true;
                }
            });

            if (need_commit) {
                data.getManager().saveChanges().then(function () {
                    alert('课程已更新结束');
                    classes_list() = selectedclazzes();
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        logger.log(err[i]);
                    }
                });
            }
        }

        function is_enabled(id)
        {
            var index = classes_list().indexOf(id.toString());
            return index <0;
        }
        //#endregion
    });