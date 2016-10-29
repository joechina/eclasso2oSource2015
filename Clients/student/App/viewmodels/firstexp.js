define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazz = ko.observable();
        var clazzes = ko.observableArray();
        var assigned_exersizes = [];
        var count = 0;

        var vm = {
            clazzes: clazzes,
            clazz: clazz,
            openclazz: openclazz,
            activate: activate,
            join: join,
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
                    var s = c.Start();
                    var e = c.End();
                    c.duration = s.getFullYear() + '/' + s.getMonth() + '/' + s.getDate() + '/ - ' + e.getFullYear() + '/' + e.getMonth() + '/' + e.getDate();

                    // get status of class joining status: 0:"未批准"; 1: "已加入"; 2:"等待批准"; -1: "申请加入"
                    c.state = "申请加入";
                    c.button = "button button-small button-block button-royal";
                    c.Users().forEach(function (u) {
                        var uid = u.UserId();

                        if (curr_uid == uid) {

                            switch (u.Status()) {
                                case 0:
                                    c.state = "未批准";
                                    c.button = "button button-small button-outline button-block button-stable disabled";
                                    break;
                                case 1:
                                    c.state = "已加入";
                                    c.button = "button button-small button-outline button-block button-balanced disabled";
                                    break;
                                case 2:
                                    c.state = "等待批准";
                                    c.button = "button button-small button-outline button-block button-energized disabled";
                                    break;
                            }
                        }
                    });

                    if (c.autoApproved)
                        c.approve = "是";
                    else
                        c.approve = "否";

                    clazzes.push(c);
                };
            });

            data.getuserexersizes(curr_uid).then(function (result) {
                if (result.results && result.results.length) {
                    result.results.forEach(function (exersize) {
                        assigned_exersizes.push(exersize.ExersizeId());
                    });
                }
            });

            $("#goback").css({ display: "none" });
            $("#refresh").css({ display: "none" });

            logger.log('first experience activated');
        }

        // will we allow students to quit a clazz so he will not see exercises any more? TBD
        function quitclazz(selected) {
            var uid = data.user().Id();
            var cid = selected().Id();

            // TODO: delete this record from UserClasses table
        }

        function join(selected) {
            var uid = data.user().Id();
            var cid = selected.Id();

            //data.manager.saveOptions.allowConcurrentSaves = true;

            if (selected.autoApproved()) {// if auto approved (i.e. public) class, we will assign exercises directly to the student
                var userclass = data.create("UserClass");
                userclass.UserId(uid);
                userclass.ClassId(cid);
                userclass.Status(1); // Status: -1:"未批准"; 1: "已加入"; 0:"等待批准";

                data.save(userclass).then(function () {
                    alert('欢迎加入: ' + selected.Name() + '!');
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        alert(err[i]);
                        logger.log(err[i]);
                    }
                });

                // assign exercises
                data.getclassexersizes(cid).then(function (exersizes) {
                    var total = exersizes.results.length;
                    var count = 0;

                    function createUE(uid, eid) {

                        return function (result) {
                            if (result.results.length <= 0) {
                                var userExersize = data.create('UserExersize');
                                userExersize.UserId(uid);
                                userExersize.ExersizeId(eid);
                                userExersize.Assigned(new Date());
                                userExersize.Progress(0);
                                userExersize.Completed('false');
                                result.entityManager.attachEntity(userExersize, userExersize.entityAspect.entityState);
                                count++;
                            }
                            else
                                count++;

                            if (total == count) {
                                result.entityManager.saveChanges().then(function () {
                                    logger.log('exersizes for class ' + cid + ' assignement is completed');
                                }).fail(function (err) {
                                    for (var i = 0; i < err.length; i++) {
                                        logger.log(err[i]);
                                    }
                                });
                            }
                        }
                    }
                    for (var i = 0; i < total; i++) {
                        var exersize = exersizes.results[i];
                        var eid = exersize.ExersizeId();

                        var callback = createUE(uid, eid);
                        var record = data.getuserexersize(uid, eid).then(callback);

                        //activate();
                    };// get a list of exersizes assigned to a class

                });
            }
            else {// if not public class, we need to wait for teacher's approval. no exercises will be assigned here. 
                var userclass = data.create("UserClass");
                userclass.UserId(uid);
                userclass.ClassId(cid);
                userclass.Status(0); // Status: -1:"未批准"; 1: "已加入"; 0:"等待批准";

                data.save(userclass).then(function () {
                    alert('申请已发送!');
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        logger.log(err[i]);
                    }
                });
            }

            router.navigate('/#');
            //activate();
        }

        function openclazz(selected) {
            clazz(selected);
                       
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });
        }

        function back() {
            router.navigateBack();
        }
        //#endregion
    });