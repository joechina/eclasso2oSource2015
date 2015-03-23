define(['plugins/router', 'knockout', 'data', 'logger','global'],
    function (router, ko, data, logger, global) {
        var problem = ko.observable();
        var quizs = ko.observableArray();
        var answer = ko.observable();
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
            answer: answer,
            currentQuiz: ko.computed(function () {
                if (problem()) {
                    return problem().Quizzes()[current()];
                }
            })            
        };

        answer.subscribe(function(newValue) {
            alert(newValue);
        });

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
            current(current() - 1);
        }

        function next() {
            //Need to check range
            current(current() + 1);
        }


        function submitanswer() {

            for (i = 0; i < problem().Quizzes().length;i++) {
                var userQuiz = data.create("UserQuiz");
                var uid = data.user().Id(); // get current user id

                var q = problem().Quizzes()[i];

                userQuiz.UserId(uid);
                userQuiz.QuizId(q.Id());
                userQuiz.Answer(q.answer);
            
                /*
                data.save(userQuiz).then(function () {
                    alert('userQuiz saved');
                    
                }).fail(function (err) {
                    for (var i = 0; i < err.length; i++) {
                        alert(err[i]);
                        logger.log(err[i]);
                    }
                });
                */

                alert('submit an answer');
            }
            router.navigateBack();
        }
        //#endregion
    });