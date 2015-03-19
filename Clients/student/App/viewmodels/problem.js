define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var problem = ko.observable();
        var quizs = ko.observableArray();

        var vm = {
            problem: problem,
            activate: activate,
            submitanswer:submitanswer,
            router: router,
            backtolist: backtolist,
            quiztypename: quiztypename,
            previous: previous,
            next:next
                        
        };

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
            });
            
            logger.log('problem activated');
        }
        
        

        function backtolist() {
            router.navigateBack();
        }

        function previous() {

        }

        function next() {

        }

        function submitanswer() {
            var userQuiz = data.create("UserQuiz");
           
            userQuiz.UserId = 1;
            userQuiz.QuizId = Id;
            userQuiz.Answer = answer;

            alert('submit an answer');
            router.navigateBack();
        }
        //#endregion
    });