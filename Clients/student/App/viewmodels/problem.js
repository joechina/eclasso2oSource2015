define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var problem = ko.observable();
        var current = ko.observable(0);
        var total = ko.observable(0);
        var currentMedia = ko.observable();
        var vm = {
            problem: problem,
            activate: activate,
            detached: detached,
            save: save,
            saveanswer: saveanswer,
            router: router,
            backtolist: backtolist,
            quiztypename: global.quiztypename,
            previous: previous,
            next: next,
            total: total,
            current: current,
            currentMedia: currentMedia,
            currentQuiz: ko.computed(function () {
                if (problem()) {
                    return problem().Quizzes()[current()];
                }
            }),
        };

        b_shouter.subscribe(function (newValue) {
            backtolist(true);
        }, this, "back_viewmodels/problem");

        return vm;

        //#region Internal Methods
        function activate(id) {
            if (data.problemList[id] == null) {
                backtolist(false);//data should be cached in exersize.js before coming here!
            }
            else {
                var p = data.problemList[id];
                problem(p);
                if (p.MediaId() > 0) {
                    if (data.mediaList[p.MediaId()] == null) {
                        data.getMedia(p.MediaId()).then(function (mdata) {
                            data.mediaList[p.MediaId()] = mdata.results[0];
                            currentMedia(mdata.results[0]);
                        })
                    }
                    else
                        currentMedia(data.mediaList[p.MediaId()]);
                }
                total(p.Quizzes().length);
                logger.log('problem ' + problem().Id() + ' activated');
            }
            current(0);
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });
        }

        function detached() {
            $('audio').each(function () { this.pause() });
        }
        function backtolist(check_ans) {
            if (check_ans && problem()) {
                var eid = problem().ExersizeSection().ExersizeId();
                if(data.exerciseQuizIdList[eid].some(function (qid) {
                    if (data.user().userquizanswersSaved[qid] == null || data.user().userquizanswersSaved[qid] == "")
                        return (data.user().userquizanswers[qid] != null && data.user().userquizanswers[qid] != "");
                    else 
                        return (data.user().userquizanswers[qid] != null && data.user().userquizanswers[qid] != "" && data.user().userquizanswers[qid] != data.user().userquizanswersSaved[qid]);
                })) {
                    save();
                }
            }
            problem(undefined);
            currentMedia(undefined);
            router.navigateBack();
        }

        function previous() {
            current(current() - 1);
        }

        function next() {
            if (current() != total() - 1)//single selection go to next after checked, block last one.
                current(current() + 1);
        }

        function save() {
            var need_save = false;
            var uid = data.user().Id();
            var p1 = new breeze.Predicate("UserId", "==", uid);
            var saved_answers = data.user().userquizanswersSaved;
            for (i = 0; i < problem().Quizzes().length; i++) {
                var q = problem().Quizzes()[i].Id();
                var cur_answer = data.user().userquizanswers[q];
                if (cur_answer != null && cur_answer != "" && (saved_answers[q] == null || saved_answers[q] != cur_answer)) {
                    var p2 = new breeze.Predicate("QuizId", "==", q);
                    var query = breeze.EntityQuery.from('UserQuizs').where(p1.and(p2));
                    var local_usrquizes = data.manager.executeQueryLocally(query);
                    var userQuiz;
                    if (local_usrquizes == null || local_usrquizes.length == 0) {
                        userQuiz = data.create('UserQuiz');
                        userQuiz.UserId(uid);
                        userQuiz.QuizId(q);
                    }
                    else
                        userQuiz = local_usrquizes[0];
                    userQuiz.Answer(cur_answer);
                    if (problem().Quizzes()[i].QuizType() == 0 || problem().Quizzes()[i].QuizType() == 1 || problem().Quizzes()[i].QuizType() == 3)
                        if (cur_answer == problem().Quizzes()[i].Answer())
                            userQuiz.Score(1);
                        else
                            userQuiz.Score(0);
                    data.manager.attachEntity(userQuiz, userQuiz.entityAspect.entityState);
                    need_save = true;
                }
            }
            if (need_save) {
                var eid = problem().ExersizeSection().ExersizeId();
                data.manager.saveChanges().then(function () {
                    data.exerciseQuizIdList[eid].forEach(function (qid) {
                        if (data.user().userquizanswers[qid] != null && data.user().userquizanswers[qid] != "")
                            data.user().userquizanswersSaved[qid] = data.user().userquizanswers[qid];
                    });
                    updateProgress(eid);
                }, eid);
            }                
        }

        function saveanswer() {
            save();
            backtolist(false);
        }

        function updateProgress(eid) {
            //update progress field for UserExercise
            var uid = data.user().Id();
            data.getUserExerciseQuizs(uid, eid).then(function (result) {
                var progress = result.results.length;
                data.getuserexersize(uid, eid).then(function (result) {
                    var ue = result.results[0];
                    ue.Progress(progress);
                    data.save(ue).then(function () {
                        logger.log(uid + '/' + eid + ' progress updated to: ' + ue.Progress());
                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                });
            });
        }
        //#endregion
    });