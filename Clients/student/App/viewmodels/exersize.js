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

        b_shouter.subscribe(function (newValue) {
            backtolist();
        }, this, "back_viewmodels/exersize");

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

                    //exersizes().forEach(loaduserquiz);
                });
            }

            if (!exersize()) {
                $("#goback").css({ display: "none" });
            }
            else {
                $("#goback").css({ display: "block" });
            }

            $("#refresh").css({display:"inline"});
                        
            logger.log('exersizes activated');
        }

        function openexersize(selected, c) {
            if (!c()) { // if not completed
                var id = selected.Id();
                data.getexersize(id).then(function (sd) {
                    var ex = sd.results[0];
                    data.keepExerciseSeq(ex);
                    exersize(ex);
                });

                $("#goback").css({ display: "block" });

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
            $("#goback").css({ display: "none" });
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
                        updateExerciseResult(eid);
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

        function updateExerciseResult(eid) {
            var manual = 0, correct_ans = 0, wrong_ans = 0, no_ans = 0;
            var answers = data.user().userexercizeanswer[eid];
            data.getexersize(eid).then(function (result) {
                results.results[0].ExersizeSection().forEach(function (section) {
                    section.Problem().forEach(function (problem) {
                        problem.Quiz().forEach(function (quiz) {
                            if (quiz.QuizType() == 1 || quiz.QuizType() == 2 || quiz.QuizType() == 3) {
                                if (answers[quiz.Id()] == null)
                                    ++no_ans
                                else if (answers[quiz.Id()] == quiz.Answer())//need case sensitive test?
                                    ++correct_ans;
                                else
                                    ++wrong_ans;
                            }
                            else
                                ++manual;
                        });
                    });
                });
            });
            if (manual + correct_ans + wrong_ans + no_ans > 0) {
                var ue = data.create('UserExersize');
                ue.UserId(data.user().Id());
                ue.ExersizeId(eid);
                ue.Result('Correct: ' + correct_ans + 'Wrong: ' + 'No answer' + no_ans + 'Manual check' + manual);
                data.save(ue);
            }
        }
    });