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
                clazzes_ids = [];
                clazz_result.results.forEach(function (cur_clazz) {
                    cur_clazz.teacher = ko.observable();
                    cur_clazz.state = ko.observable("未加入");
                    var cur_index = clazzes().length;
                    clazzes_ids.push(cur_clazz.Id());
                    clazzes.push(cur_clazz);
                    if (typeof cur_clazz.TeacherId != "undefined")
                    {
                        var callback_fun = makeCallBack(cur_index);
                        var tid = cur_clazz.TeacherId();
                        data.getuser(tid).then(callback_fun);
                    }
                });

                data.getUserClasses(uid).then(function (result) {
                    userclazzes(result.results);
                    result.results.forEach(function (my_clazz) {
                        var index = clazzes_ids.indexOf(my_clazz.ClassId());
                        if(index >= 0)
                            clazzes()[index].state("已加入");
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


        function back() {
            router.navigateBack();
        }
        //#endregion
    });