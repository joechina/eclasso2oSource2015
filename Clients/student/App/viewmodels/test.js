define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var audio = ko.observable();

        var vm = {
            activate: activate,
            //compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            audio: audio,

            addSection: addSection,
            deleteSection: deleteSection,
            deleteProblem: deleteProblem,
            deleteQuiz:deleteQuiz,
            addProblem: addProblem,
            addQuiz: addQuiz,
            upload: upload,
            uploadimage: readFile
        };

        return vm;

        //#region Internal Methods
        function activate() {
            vm.exercise = data.create('Exersize');

            logger.log('input activated');
            return true;
        }

        //function compositionComplete() {
        //    document.getElementById('mp3file').addEventListener("change", readFile, false);
        //}

        function readFile(prob, file) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var resultdata = e.target.result;
                var newmedia = data.create('Media');
                newmedia.Content(resultdata);
                newmedia.Type("mp3");
                prob.Media(newmedia);
               
            };
            FR.readAsDataURL(file);
        }

        function upload() {
            data.save(vm.exercise).then(function () {
                Alert('Exercise Uploaded. Please check database');
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });            
        }

        function addProblem(sec) {
            var newprob = data.create('Problem');
            newprob.ExersizeSection(sec);
            sec.Problems.push(newprob);
        }

        function deleteProblem(prob) {
            prob.ExersizeSection().Problems.remove(prob);
            prob.entityAspect.setDeleted();
        }

        function deleteSection(sec) {
            sec.Exersize().Sections.remove(sec);
            sec.entityAspect.setDeleted();
        }

        function deleteQuiz(quiz) {
            quiz.Problem().Quizzes.remove(quiz);
            quiz.entityAspect.setDeleted();
        }

        function addSection(exec) {
            var newsec = data.create('ExersizeSection');
            newsec.Exersize(exec);
            exec.Sections.push(newsec);
        }

        function addQuiz(prob) {
            var newquiz = data.create('Quiz');
            newquiz.Problem(prob);
            prob.Quizzes.push(newquiz);
        }
        //#endregion
    });