define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var exersize = ko.observable(null);
        var exersizes = ko.observableArray(null); // all exersizes assigned to a student
        var myexersizes = ko.observableArray(null); // exersizes assigned to a student with a specific category

        var login = {
            exersizes: exersizes,
            myexersizes: myexersizes,
            exersize: exersize,
            activate: activate,
            openexersize: openexersize,
            submit: submit,
            myreport: myreport,
            router: router,
            backtolist: backtolist,
        };

        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload exersize');
        }, this, "refresh_viewmodels/exersize");

        b_shouter.subscribe(function (newValue) {
            if (exersize()) {
                backtolist();
            }
            else {
                router.navigate('/#ex_main');
            }
        }, this, "back_viewmodels/exersize");

        return login;

        //#region Internal Methods
        function activate(cat) {
            var uid = data.user().Id();
            if (!exersize()) {
                init();
                data.getuserexersizes(uid).then(function (data) {
                    exersizes(data.results);

                    //get exersizes assigned to a user based on category selected.
                    for (var i = 0; i < exersizes().length; i++) {
                        var e = exersizes()[i];
                        if (e.Exersize().Category() == cat) {
                            /*if (e.Exersize().Description().length > 5) {
                                e.Exersize().Description(e.Exersize().Description().substring(0, 5) + "...");
                            }*/
                            myexersizes.push(e);
                        }
                    }
                });
            }

            $("#goback").css({ display: "block" });

            $("#refresh").css({ display: "inline" });

            logger.log('exersizes activated');
        }

        function openexersize(selected, c) {
            if (!c()) { // if not completed
                var id = selected.Id();
                if (data.exerciseList[id] == null) {
                    data.getexersize(id).then(function (sd) {
                        data.exerciseQuizIdList[id] = [];
                        data.exerciseList[id] = sd.results[0];
                        var ex = sd.results[0];
                        data.keepExerciseSeq(ex);
                        ex.Sections().forEach(function (s) {
                            s.Problems().forEach(function (p) {
                                data.problemList[p.Id()] = p;
                                p.Quizzes().forEach(function (q) {
                                    if (data.exerciseQuizIdList[id].indexOf(q.Id()) < 0)
                                        data.exerciseQuizIdList[id].push(q.Id());
                                });
                            });
                        });
                        if (data.user().answerextracted[id] == null || data.user().answerextracted[id] == false)
                            data.getUserExerciseQuizs(data.user().Id(), id).then(function (result) {
                                result.results.forEach(function (usrQuiz) {
                                    data.user().userquizanswersSaved[usrQuiz.QuizId()] = usrQuiz.Answer();
                                    data.user().userquizanswers[usrQuiz.QuizId()] = usrQuiz.Answer();
                                });
                                data.user().answerextracted[id] = true;
                                exersize(ex);
                            }).fail(function (err) {
                                exersize(ex);
                            });
                        else
                            exersize(ex);
                    });
                }
                else
                    exersize(data.exerciseList[id]);

                $("#goback").css({ display: "block" });

                $("#refresh").css({ display: "none" });
            }
            else {
                //alert('习题已递交，请查看报告');
                myreport();
            }
        }

        function init() {
            exersizes.removeAll();
            myexersizes.removeAll();
        }

        function backtolist() {
            exersize(undefined);
            $("#refresh").css({ display: "inline" });
            $("#goback").css({ display: "block" });
        }

        function submit(ex) {
            //TODO: Remind users if there is any quiz not answered, and get confirmed for submission.
            if (!confirm('确定提交习题: ' + ex.Name() + ' ?')) {
                return;
            }

            var uid = data.user().Id();
            var eid = ex.Id();
            data.getuserexersize(uid, eid).then(function (result) {
                var ue;
                if (result.results.length == 0) {//if not exist, create a new record
                    ue = data.create('UserExersize');
                    ue.UserId(uid);
                    ue.ExersizeId(eid);
                }
                else
                    ue = result.results[0];
                ue.Completed('true');

                data.save(ue).then(function () {
                    //alert('习题: ' + ex.Name() + ' 已提交');
                    logger.log('学生: ' + uid + '习题: ' + eid + '已提交');
                    if (data.user().answerextracted[eid] == null || data.user().answerextracted[eid] == false) {
                        data.getUserExerciseQuizs(data.user().Id(), eid).then(function (result) {
                            result.results.forEach(function (usrQuiz) {
                                data.user().userquizanswersSaved[usrQuiz.QuizId()] = usrQuiz.Answer();
                                data.user().userquizanswers[usrQuiz.QuizId()] = usrQuiz.Answer();
                            });
                            data.user().answerextracted[eid] = true;
                            updateExerciseResult(eid, ue);
                        });
                    }
                    else
                        updateExerciseResult(eid, ue);
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        logger.log(err[i]);
                    }
                });
            }, eid);
            //router.navigate('/#exersize');
            backtolist();
        }

        function myreport() {
            router.navigate('/#myreport');
        }

        //#endregion
        function updateExerciseResult(eid, ue) {
            if (data.exerciseList[eid] == null) {
                data.getexersize(eid).then(function (sd) {
                    data.exerciseQuizIdList[eid] = [];
                    data.exerciseList[eid] = sd.results[0];
                    var ex = sd.results[0];
                    data.keepExerciseSeq(ex);
                    ex.Sections().forEach(function (s) {
                        s.Problems().forEach(function (p) {
                            data.problemList[p.Id()] = p;
                            p.Quizzes().forEach(function (q) {
                                if (data.exerciseQuizIdList[eid].indexOf(q.Id()) < 0)
                                    data.exerciseQuizIdList[eid].push(q.Id());
                            });
                        });
                    });
                    calculateExerciseResult(eid, ue)
                });
            }
            else
                calculateExerciseResult(eid, ue)
        }

        function calculateExerciseResult(eid, ue){
            var manual = 0, correct_ans = 0, wrong_ans = 0, no_ans = 0;
            var answers = data.user().userquizanswersSaved;
            var s = data.exerciseList[eid].Sections();
            data.exerciseList[eid].Sections().forEach(function (s) {
                s.Problems().forEach(function (p) {
                    p.Quizzes().forEach(function (quiz) {
                        if (answers[quiz.Id()] == null || answers[quiz.Id()] == "")
                            ++no_ans
                        else if (quiz.QuizType() == 1 || quiz.QuizType() == 2 || quiz.QuizType() == 3) {
                            if (answers[quiz.Id()] == quiz.Answer())//need case sensitive test?
                                ++correct_ans;
                            else
                                ++wrong_ans;
                        }
                        else
                            ++manual;
                    });
                });
            });
            if (manual + correct_ans + wrong_ans + no_ans > 0) {
                var result = "正确 " + correct_ans + ", 错误 " + wrong_ans;
                if (no_ans)
                    result += ", 没回答 " + no_ans;
                if (manual)
                    result += ", 等待批改 " + manual;
                ue.Result(result);
                data.save(ue);
            }
        }
    });