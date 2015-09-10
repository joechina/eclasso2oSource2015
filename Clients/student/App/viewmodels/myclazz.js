define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var userclazzes = ko.observableArray();
        var clazzes = ko.observableArray();
        var classes_list = ko.observableArray();
        var clazzes_ids = [];

        var vm = {
            clazzes: clazzes,
            userclazzes: userclazzes,
            classes_list: classes_list,
            activate: activate,
            quitclazz: quitclazz,
            router: router,
            clazzes_ids: clazzes_ids,
        };

        b_shouter.subscribe(function (newValue) {
            back();
        }, this, "back_viewmodels/myclazz");

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
            data.getUserClasses(uid).then(function (result) {
                clazzes.removeAll();
                clazzes_ids = [];
                userclazzes(result.results);
                result.results.forEach(function (my_clazz) {
                    clazzes_ids.push(my_clazz.ClassId());
                });
                if (clazzes_ids.length > 0) {
                    data.getClasses().then(function (clazz_result) {
                        clazz_result.results.forEach(function (cur_clazz) {
                            if (clazzes_ids.indexOf(cur_clazz.Id()) >= 0) {
                                cur_clazz.teacher = ko.observable();
                                cur_clazz.state = ko.observable("已加入");
                                var cur_index = clazzes().length;
                                clazzes.push(cur_clazz);
                                if (typeof cur_clazz.TeacherId != "undefined") {
                                    var callback_fun = makeCallBack(cur_index);
                                    var tid = cur_clazz.TeacherId();
                                    data.getuser(tid).then(callback_fun);
                                }
                            }
                        });
                    });
                }
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


        function back() {
            router.navigateBack();
        }
        //#endregion
    });