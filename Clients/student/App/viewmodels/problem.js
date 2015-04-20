define(['plugins/router', 'knockout', 'data', 'logger','global'],
    function (router, ko, data, logger, global) {
        var problem = ko.observable();
        var quizs = ko.observableArray();
        var current = ko.observable(0);

        var vm = {
            problem: problem,
            activate: activate,
            submitanswer:submitanswer,
            router: router,
            backtolist: backtolist,
            quiztypename: global.quiztypename,
            previous: previous,
            next: next,
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

                if (p.Quizzes().length == 1) {
                    $("#submit").css({ visibility: "visible" });
                    document.getElementById('next').disabled = true;
                }
            });
           
            $("#goback").css({ display: "block" });

            logger.log('problem activated');
        }
        
        function backtolist() {
            //router.navigateBack();
            router.navigate('/#exersizes')
        }

        function previous() {
            //Need to check range          
            if (current() == problem().Quizzes().length-1) {
                document.getElementById('next').disabled = false;
                $("#submit").css({ visibility: "hidden" });
            }

            current(current() - 1);
            if (current() == 0) {
                document.getElementById('previous').disabled = true;
                document.getElementById('next').disabled = false;
            }

            //Todo: need to set back previous answer value if any
        }

        function next() {
            //Need to check range
            if (current() == 0)
                document.getElementById('previous').disabled = false;

            current(current() + 1);

            if (current() == problem().Quizzes().length-1) {
                document.getElementById('next').disabled = true;
                $("#submit").css({ visibility: "visible" });               
            }
        }
        
        function submitanswer() {
            //TODO: Need to remind users when a quiz is not answered, and get confirmed for submission.
          
            for (i = 0; i < problem().Quizzes().length;i++) {

                var userQuiz = data.create("UserQuiz");
                var uid = data.user().Id(); // get current user id

                var q = problem().Quizzes()[i];

                userQuiz.UserId(uid);
                userQuiz.QuizId(q.Id());
               
                userQuiz.Answer(q.answer());                
                                
                data.save(userQuiz).then(function () {
                    logger.log ('userQuiz saved');
                    
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        logger.log(err[i]);
                    }
                });
                
                logger.log('submit an answer:' + q.answer());

            }
        }
        //#endregion
    });