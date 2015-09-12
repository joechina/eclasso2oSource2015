define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var userclasses = ko.observableArray();
        var myclasses = ko.observableArray();

        var vm = {
            myclasses: myclasses,
            userclasses: userclasses,
            activate: activate,
            router: router,
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

            data.getUserClasses(uid).then(function (result) {
                result.results.forEach(function (c) {
                    var s = c.Class().Start();
                    var e = c.Class().End();
                    c.duration = s.getFullYear() + '/' + s.getMonth() + '/' + s.getDate() + '/ - ' + e.getFullYear() + '/' + e.getMonth() + '/' + e.getDate();

                    switch (c.Status()) {
                        case 0:
                            c.state = "未批准";
                            break;
                        case 1:
                            c.state = "已加入";
                            break;
                        case 2:
                            c.state = "等待批准";
                    }

                    data.getuser(c.Class().TeacherId()).then(function (t) {
                        c.teacher = t.results[0].Name();

                        myclasses.push(c);
                    });


                });

            });
            
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

            logger.log('my clazzes activated');
        }

        // will we allow students to quit a clazz so he will not see exercises any more? TBD
        function quitclazz(selected) {
            var uid = data.user().Id();
            var cid = selected().Id();

            // TODO: delete this record from UserClasses table
        }

        function join() {
            router.navigate('/#joinclazz');
        }

        function back() {
            router.navigateBack();
        }
        //#endregion
    });