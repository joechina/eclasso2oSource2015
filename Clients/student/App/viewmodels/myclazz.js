define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazz = ko.observable();
        var clazzes = ko.observableArray();
        var assigned_exersizes = [];

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
                    c.state = "申请加入";
                    c.button = "button button-small button-block button-royal";
                    result.results[i].Users().forEach(function (u) {
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

        function join(selected) {
            var uid = data.user().Id();
            var cid = selected.Id();

            data.manager.saveOptions.allowConcurrentSaves = true;

            if (selected.autoApproved()) {// if auto approved (i.e. public) class, we will assign exercises directly to the student

                //data.getuserclass(uid, cid).then(function (result) {
                   // if (result.results.length ==0) {
                        //create userclass record
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
                   // }
               // });

                // assign exercises
                data.getclassexersizes(cid).then(function (exersizes) {

                    exersizes.results.forEach(function (exersize) {
                        var eid = exersize.ExersizeId();

                        data.getuserexersize(uid, eid).then(function (result) {
                            if (result.results.length == 0) {
                                var userexersize = data.create("UserExersize");
                                userexersize.UserId(uid);
                                userexersize.ExersizeId(eid);
                                userexersize.Assigned(new Date());
                                //userexersize.Deadline(selected.End);
                                userexersize.Progress(0);
                                userexersize.Completed('false');

                                data.save(userexersize).then(function () {
                                    logger.log('create userexerise: ' + uid + '/' + eid);

                                }).fail(function (err) {
                                    for (var i = 0; i < err.length; i++) {
                                        logger.log(err[i]);
                                    }
                                });
                            }// check if user exersize record exists
                            else {
                                logger.log(uid + "/" + eid + "exist already");
                            }
                        });// loop on exersizes assigend to a class
                    });// get a list of exersizes assigned to a class
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

/*
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
*/