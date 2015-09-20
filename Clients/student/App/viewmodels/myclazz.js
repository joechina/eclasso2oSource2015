define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazz = ko.observable();
        var clazzes = ko.observableArray();

        var vm = {
            clazzes: clazzes,
            clazz: clazz,
            openclazz:openclazz,
            activate: activate,
            join:join,
            router: router,
        };

        b_shouter.subscribe(function (newValue) {
            if (clazz())
                backtolist();
            else
                back();
        }, this, "back_viewmodels/myclazz");

        return vm;

        //#region Internal Methods

        function activate() {
            var curr_uid = data.user().Id();

            data.getClasses().then(function (result) {
                clazzes.removeAll();
 
                for (var i = 0; i < result.results.length; i++) {
                    var c = result.results[i];
                    var curr_uid = data.user().Id();

                    // reformat class date
                    var s = result.results[i].Start();
                    var e = result.results[i].End();
                    c.duration = s.getFullYear() + '/' + s.getMonth() + '/' + s.getDate() + '/ - ' + e.getFullYear() + '/' + e.getMonth() + '/' + e.getDate();

                    // get status of class joining status: 0:"未批准"; 1: "已加入"; 2:"等待批准"; -1: "申请加入"
                    c.state = "-1";
                    result.results[i].Users().forEach(function (u) {
                        var uid = u.UserId();

                        if (curr_uid == uid) {
                            c.state = u.Status();
                        }
                    });

                    if (c.autoApproved)
                        c.approve = "是";
                    else
                        c.approve = "否";

                    clazzes.push(c);
                };
            });

            $("#goback").css({ display: "block" });

            if (clazz()) {
                $("#main_title").css({ float: "left", position: "relative" });
                $("#refresh").css({ display: "none" });
            } else {
                $("#main_title").css({ float: "center", position: "absolute" });
                $("#refresh").css({ display: "inline" });
            }

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

        function openclazz(selected) {
            clazz(selected);

            $("#main_title").css({ float: "left", position: "relative" });

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });
        }

        function backtolist() {

                clazz(undefined);
                $("#main_title").css({ float: "center", position: "absolute" });

                $("#goback").css({ display: "block" });

                $("#refresh").css({ display: "inline" });

        }

        function back() {
            router.navigate('/#me');
        }
        //#endregion
    });