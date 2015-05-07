define(['plugins/router', 'knockout', 'data', 'logger','global'],
    function (router, ko, data, logger, global) {
        var problem = ko.observable();
        var current = ko.observable(0);
        var total = ko.observable(0);

        var vm = {
            problem: problem,
            activate: activate,
            detached: detached,
            submitanswer:submitanswer,
            router: router,
            backtolist: backtolist,
            quiztypename: global.quiztypename,
            previous: previous,
            next: next,
            total: total,
            current:current,
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
            data.getproblem(id).then(function (pdata) {
                var p = pdata.results[0];
                if (p.MediaId() > 0) {
                    data.getmedia(p.MediaId()).then(function (mdata) {
                        p.Media(mdata.results[0]);
                        problem(p);
                    })
                }
                else {
                    problem(p);
                }

                total(p.Quizzes().length);

            });

            current(0);
            $("#goback").css({ display: "block" });

            logger.log('problem activated');
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

            current(current() + 1);
            /*
            if (current() == total()-1) {
                document.getElementById('next').disabled = true;
                document.getElementById('submit').disabled = false;
      
            }
            */
        }
        
        function submitanswer() {
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
                '<div class="m，课odal-dialog modal-m">' +
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

                var Ok = ko.observable(false);

                var uid = data.user().Id(); // get current user id
                var q = problem().Quizzes()[i];

                data.getUserAnswer(uid, q.Id()).then(function (data) {
                    
                    if (data.results.length == 0) {
                        Ok(true);
                    }

                    if (Ok) {
                        var userQuiz = data.create("UserQuiz");

                        userQuiz.UserId(uid);
                        userQuiz.QuizId(q.Id());

                        userQuiz.Answer(q.answer());

                        data.save(userQuiz).then(function () {
                            logger.log('userQuiz saved');

                        }).fail(function (err) {
                            for (var i = 0; i < err.length; i++) {
                                logger.log(err[i]);
                            }
                        });

                        logger.log('submit an answer:' + q.answer());
                    }
                });


            }

            $dialog.modal('hide');
            backtolist();
        }
        //#endregion
    });