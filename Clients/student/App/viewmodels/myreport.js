define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var exersizes = ko.observableArray();
        var ex_alter = ko.observableArray();
        var ex_reflets = ko.observableArray();
        var ex_simple = ko.observableArray();
        var ex_festival = ko.observableArray();
        var exersize = ko.observable();
        var sections = ko.observableArray();
        var problem = ko.observable();
        var answer = ko.observable();
        var ex = ko.observable();
        var cat = ko.observable();
        var user = ko.observable();

        var vm = {
            ex_alter: ex_alter,
            ex_reflets: ex_reflets,
            ex_simple: ex_simple,
            ex_festival:ex_festival,
            exersize: exersize,
            user:user,
            ex: ex,
            activate: activate,
            router: router,
            quiztypename: global.quiztypename,
            categories: global.categories,
            cat: cat,
            openex:openex,
            back: back,

        };

        shouter.subscribe(function (newValue) {
            init();
            activate();
            logger.log('reload my report');
        }, this, "refresh_viewmodels/myreport");

        b_shouter.subscribe(function (newValue) {
            if (exersize()) {
                backtolist();
            }
            else
                back();

        }, this, "back_viewmodels/myreport");

        return vm;

        function activate(eid) {
            user(data.user());

            if (exersizes().length == 0) {
                data.getuserexersizes_status(user().Id(), true).then(function (data) {
                    exersizes(data.results);
                    for (var i = 0; i < data.results.length; i++) {
                        var ex = data.results[i].Exersize();
                        ex.Result= data.results[i].Result();
                        if (ex.Category() == '0') {
                            ex_alter.push(ex);
                        }
                        else if (ex.Category() == '1') {
                            ex_simple.push(ex);
                        }
                        else if (ex.Category() == '2') {
                            ex_festival.push(ex);
                        }
                        else if (ex.Category() == '3') {
                            ex_reflets.push(ex);
                        }
                    }
                });
            }

            if (eid != 0) {
                openex(eid);
                return;
            }

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "inline" });
        }

        function init() {
            exersize(undefined);
            ex(undefined);
            cat(undefined);
            ex_alter.removeAll();
            ex_reflets.removeAll();
            ex_simple.removeAll();
            ex_festival.removeAll();
            exersizes.removeAll();
        }

        function openex(eid) {
       
            if (data.exerciseList[eid] == null) {
                data.getexersize(eid).then(function (sd) {
                    var ex = sd.results[0];
                    data.keepExerciseSeq(ex);
                    data.exerciseList[eid] = ex;
                    data.exerciseQuizIdList[eid] = [];
                    ex.Sections().forEach(function (s) {
                        s.Problems().forEach(function (p) {
                            data.problemList[p.Id()] = p;
                            p.Quizzes().forEach(function (q) {
                                if (data.exerciseQuizIdList[eid].indexOf(q.Id()) < 0)
                                    data.exerciseQuizIdList[eid].push(q.Id());
                            });
                        });
                    });
                    data.getUserExerciseQuizs(data.user().Id(), eid).then(function (result) {
                        result.results.forEach(function (usrQuiz) {
                            data.user().userquizanswersSaved[usrQuiz.QuizId()] = usrQuiz.Answer();
                            data.user().userquizanswers[usrQuiz.QuizId()] = usrQuiz.Answer();
                        });
                        data.user().answerextracted[eid] = true;
                        exersize(ex);
                    }).fail(function (err) {
                        exersize(ex);
                    });
                })
            }
            else
                exersize(data.exerciseList[eid]);
            $("#refresh").css({ display: "none" });
        }

        function back() {
            //router.navigate('/#me');
            router.navigateBack();
        }

        function backtolist() {
            exersize(undefined);

            $("#goback").css({ display: "block" });

            $("#refresh").css({ display: "inline" });
        }
    });