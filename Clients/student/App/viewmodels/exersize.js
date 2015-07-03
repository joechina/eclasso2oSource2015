define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var exersize = ko.observable(null);
        var exersizes = ko.observableArray(null);
        var def_exersizes = ko.observableArray(null);
        var add_exersizes = ko.observableArray(null);
        var saison_exersizes = ko.observableArray(null);
        var other_exersizes = ko.observableArray(null);

        var login = {
            exersizes: exersizes,
            def_exersizes: def_exersizes,
            add_exersizes: add_exersizes,
            saison_exersizes: saison_exersizes,
            other_exersizes:other_exersizes,
            exersize:exersize,
            activate: activate,
            openexersize: openexersize,
            submit: submit,
            router: router,
            backtolist: backtolist,
        };
        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload exersize');
        }, this, "refresh_viewmodels/exersize");

        return login;

        //#region Internal Methods
        function activate() {
            var uid = data.user().Id();
            if (!exersize()) {
                init();
                data.getuserexersizes(uid).then(function (data) {
                    exersizes(data.results);

                    //get exersizes assigned to a user: 0 refers to exercises related to lessons, 1 refers to additional exercises
                    for (var i = 0; i < exersizes().length; i++) {
                        var e = exersizes()[i];
                        if (e.Exersize().Category() == "0") { // Alter Ego+ 习题
                            def_exersizes.push(e);
                        }
                        else if (e.Exersize().Category() == "1") { // Festival 习题
                            add_exersizes.push(e);
                        }
                        else if (e.Exersize().Category() == "2") { // Saison 习题
                            saison_exersizes.push(e);
                        }
                        else
                            other_exersizes.push(e);
                    }
                    exersizes().forEach(loaduserquiz);
                });
            }
            
            $("#goback").css({ display: "none" });
            $("#refresh").css({display:"inline"});
                        
            logger.log('exersizes activated');
        }

        function openexersize(selected, c) {
            if (!c()) { // if not completed
                var id = selected.Id();
                data.getexersize(id).then(function (data) {
                    exersize(data.results[0]);
                });
                $("#refresh").css({ display: "none" });
            }
            else {
                alert('习题已递交，请查看我的报告');
            }
        }

        function init() {
            exersizes.removeAll();
            def_exersizes.removeAll();
            add_exersizes.removeAll();
            saison_exersizes.removeAll();
            other_exersizes.removeAll();
        }

        function backtolist() {
            exersize(undefined);
            $("#refresh").css({ display: "inline" });

        }

        function submit(ex) {
            var uid = data.user().Id();
            var eid = ex.Id();
            data.getuserexersize(uid, eid).then(function (result) {
                if (result.results.length == 0) {//if not exist, create a new record
                    var ue = data.create('UserExersize');
                    ue.UserId(uid);
                    ue.ExersizeId(eid);
                    ue.Completed('true');

                    data.save(ue).then(function () {
                        alert('习题 已提交');
                        logger.log('学生: ' + uid + '习题: ' + eid + '已提交');

                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                
                }
                else {// if record exists, update the Completed field
                    result.results[0].Completed('true');

                    data.save(result.results[0]).then(function () {
                        alert('习题: ' + eid + ' 已提交');
                        logger.log('学生: ' + uid + '习题: ' + eid + '已提交');

                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                }
            })

            router.navigate('/#exersize');
        }

        //#endregion
        function loaduserquiz(exercise) {
            var uid = data.user().Id();
            var eid = exercise.ExersizeId();
            if (data.user().userexercizeanswer[eid] == null) {
                data.getUserExerciseQuizs(uid, eid).then(function (result) {
                    var workedarray = result.results;
                    var userquiz = {};
                    workedarray.forEach(function (data) {
                        userquiz[data.Id()] = data;// get related user quiz: data.Id() => userquiz.Id
                    })
                    data.user().userexercizeanswer[exercise.ExersizeId()] = userquiz;
                })
            }
        }
    });