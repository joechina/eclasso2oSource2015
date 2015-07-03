define(['plugins/router', 'knockout', 'data', 'logger','global'],
    function (router, ko, data, logger, global) {
        var problem = ko.observable();
        var current = ko.observable(0);
        var total = ko.observable(0);

        var vm = {
            problem: problem,
            activate: activate,
            detached: detached,
            saveanswer: saveanswer,
            router: router,
            backtolist: backtolist,
            quiztypename: global.quiztypename,
            previous: previous,
            next: next,
            total: total,
            current: current,
            currentQuiz: ko.computed(function () {
                if (problem()) {
                    return problem().Quizzes()[current()];
                }
            })
        };

        //answer.subscribe (function (newValue) {           
        //    problem().Quizzes()[current()].answer = newValue;
        //});

        return vm;

        //#region Internal Methods
        function activate(id) {
            //TODO: fetch saved quiz answers from userquiz table so students do not need to re-do existing answers. 
            data.getproblem(id).then(function (pdata) {
                var p = pdata.results[0];

                if (p.MediaId() > 0) {
                    data.getMedia(p.MediaId()).then(function (mdata) {
                        p.Media(mdata.results[0]);
  
                    })
                }

                problem(p);

                total(p.Quizzes().length);

                logger.log('problem ' + problem().Id()+' activated');
            });

            current(0);
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

        }
        
        function detached() {
            $('audio').each(function(){ this.pause() });
        }

        function backtolist() {
            problem(undefined);
            router.navigateBack();
        }

        function previous() {
            /*        
            if (current() == problem().Quizzes().length-1) {
                document.getElementById('next').disabled = false;
                document.getElementById('submit').disabled = false;
            }
            */
            current(current() - 1);

            /*
            if (current() == 0) {
                document.getElementById('previous').disabled = true;
                document.getElementById('next').disabled = false;
            }
            */
        }

        function next() {
            /*
            if (current() == 0)
                document.getElementById('previous').disabled = false;
            */
            if (current() != total() - 1)//single selection go to next after checked, block last one.
                current(current() + 1);
            /*
            if (current() == total()-1) {
                document.getElementById('next').disabled = true;
                document.getElementById('submit').disabled = false;
      
            }
            */
        }
        
        function saveanswer() {
            //Remind users when a quiz is not answered, and get confirmed for submission.
            var n = 0;
            for (i = 0; i < problem().Quizzes().length; i++) {
                var q = problem().Quizzes()[i];
                if (q.answer() == null) {
                    ++n;
                }
            }
            if (n > 0) {
                var msg = '有' + n + '道题没回答，继续递交吗？'
                var r = confirm(msg);
                if (r == false)
                    return;
            }

            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15% overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                '<div class="modal-header"><h3 style="margin:0;">递交中...</h3></div>' +
                '<div class="modal-body">' +
                '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 0%"/></div>' +
                '</div>' +
                '</div></div></div>'
            );

            $dialog.modal();

            // TODO: student might submit part of answers, then re-submit. need to check if an answer exists to avoid duplicated records in UserQuiz table. 
            for (i = 0; i < problem().Quizzes().length;i++) {
                var text_string = 'width: ' + Math.round(i * 10 / problem().Quizzes().length) * 10 + '%';
                $dialog.find('.progress-bar').attr('style', text_string);

                var uid = data.user().Id(); // get current user id
                var q = problem().Quizzes()[i];
                var qid = q.Id(); // get current quiz id

                if (q.answer() != null) {
                   
                    submituserquiz(uid, qid, q);
                }
                //else {
                  //  alert('问题: ' + q.Challenge() + ' 没有回答');
                //}
            }

            updateProgress(problem);

            $dialog.modal('hide');

            backtolist();
        }

        function submituserquiz(uid, qid, q) {

            data.getUserQuizs(uid, qid).then(function (results) {
                var a = ko.observable();
                // combine multi selection answer by ","
                if (q.QuizType() == 3) {
                    a(q.answer().join(','));
                }
                else {
                    a(q.answer());
                }

                if (results.results.length == 0) {// if such record does not exit, create a new one

                    var userQuiz = data.create('UserQuiz');

                    userQuiz.UserId(uid);
                    userQuiz.QuizId(qid);

                    userQuiz.Answer(a());

                    data.save(userQuiz).then(function () {
                        logger.log('userQuiz:' + uid + '/' + qid + ' with answer: ' + a());

                        updateProgress(q.Prblem());

                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                }
                else {// if yes, overwirte previous answer
                    results.results[0].Answer(a());
                    data.save(results.results[0]).then(function () {
                        updateProgress(q.Problem());
                        logger.log('userQuiz:' + uid + '/' + qid + ' with answer: ' + a());

                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                }
            }).fail(function (err) {
                alert(err.message);
            });
        }

        function updateProgress(problem) {
            //update progress field for UserExercise
            var eid = problem().ExersizeSection().ExersizeId();
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