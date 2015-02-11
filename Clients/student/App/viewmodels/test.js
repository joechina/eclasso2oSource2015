define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var audio = ko.observable();

        ////one problem
        //var prob1 = "<label class='control-label'>Problem ";
        //var prob2 = ":</label><input id='problem_";
        //var prob3 = "' name='name' type='text'>";

        ////one example
        //var ex1 = "<label class='control-label'>Example ";
        //var ex2 = ":</label><input id='example' name='name' type='text'>";

        ////a list of quiz
        //var q1 = "<ul id='quizs_";
        //var q2 = "' style='list-style-type:none'><li><label class='control-label'>Quiz ";
        //var q3 = ": </label><input id='quiz_";
        //var q4 = "' name='name' type='text'></li></ul>";

        //var pidx = 1;//last problem in the page
        //var qidx = 1;//last quiz in the page
        //var sidx = 1;//last section in the page

        var vm = {
            activate: activate,
            //compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            audio: audio,
            //addQuiz: function () {
            //    var lastQ = "#quizs_" + sidx + "_" + pidx;
            //    qidx++;
            //    var qID =  sidx + "_" + pidx + "_" + qidx;
            //    var newQ = "quiz_" + qID;
            //    $(lastQ).append("<li><label class='control-label' >Quiz "+ qID +": </label><input id='"+ newQ + "' name='name' type='text' class=''></li>");
            //},

            addSection: addSection,
            addProblem: addProblem,
            addQuiz: addQuiz,
            upload: upload,
            readfile: readFile
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

        function readFile(quiz, file) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var resultdata = e.target.result;
                quiz.QuizDetail(resultdata);
            };
            FR.readAsDataURL(this.files[0]);
        }

        function upload() {
            data.save(vm.exercise).then(function () {
                Alert('Exercise Uploaded. Please check database');
            });
        }

        function addProblem(sec) {
            var newprob = data.create('Problem');
            sec.Problems.push(newprob);
        }

        function addSection(exec) {
            var newsec = data.create('ExersizeSection');
            exec.Sections.push(newsec);
        }

        function addQuiz(prob) {
            var newquiz = data.create('Quiz');
            prob.Quizzes.push(newquiz);
        }
        //#endregion
    });