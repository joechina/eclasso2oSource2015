define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var audio = ko.observable();

        //one problem
        var prob1 = "<label class='control-label'>Problem ";
        var prob2 = ":</label><input id='problem_";
        var prob3 = "' name='name' type='text'>";

        //one example
        var ex1 = "<label class='control-label'>Example ";
        var ex2 = ":</label><input id='example' name='name' type='text'>";

        //a list of quiz
        var q1 = "<ul id='quizs_";
        var q2 = "' style='list-style-type:none'><li><label class='control-label'>Quiz ";
        var q3 = ": </label><input id='quiz_";
        var q4 = "' name='name' type='text'></li></ul>";

        var pidx = 1;//last problem in the page
        var qidx = 1;//last quiz in the page
        var sidx = 1;//last section in the page

        var vm = {
            activate: activate,
            compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            audio: audio,
            addQuiz: function () {
                var lastQ = "#quizs_" + sidx + "_" + pidx;
                qidx++;
                var qID =  sidx + "_" + pidx + "_" + qidx;
                var newQ = "quiz_" + qID;
                $(lastQ).append("<li><label class='control-label' >Quiz "+ qID +": </label><input id='"+ newQ + "' name='name' type='text' class=''></li>");
                
            },
            addSection: addSection,
            addProblem:addProblem
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('input activated');
            return true;
        }

        function compositionComplete() {
            document.getElementById('mp3file').addEventListener("change", readFile, false);
        }

        function readFile() {
            if (this.files && this.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e) {
                    var resultdata = e.target.result;
                    audio(resultdata);
                };
                FR.readAsDataURL(this.files[0]);
            }
        }

        function upload() {
            //Save to Server
            Alert('Need to add logic to store the data to server');
        }

        function addProblem() {
            qidx = 1; // reset quiz index to 1 when creating a new problem
            pidx++;
            var qID = sidx + "_" + pidx + "_" + qidx; // ID for an individual quiz
            var pID = sidx + "_" + pidx; // ID for an individual problem

            var child = "<li>" + prob1 + sidx + "_" + pidx + prob2 + pID+prob3+ex1 +pID + ex2 + q1 + sidx + "_" + pidx + q2 + qID + q3+qID+q4+"</li>";
            alert(child);
            $("#problems_" + sidx).append(child);
        }

        function addSection() {
            //reset problem index and quiz index to zero for a new section
            pidx=1;
            qidx = 1;
            sidx++;

            var s = "<ul id='section_" + sidx + "' style='list-style-type:none'><li><label class='control-label'>Section "+sidx+":</label><input id='sectionName' name='name' type='text'></li>";
            var qID = sidx + "_" + pidx + "_" + qidx; // ID for an individual quiz
            var pID = sidx + "_" + pidx; // ID for an individual problem
            var p = "<li>" + prob1 + sidx + "_" + pidx + prob2 + pID+prob3+ex1+pID+ex2 + q1 + sidx + "_" + pidx + q2 + qID + q3 + qID + q4 + "</li>";

            var child = s + "<ul id='problems_" + sidx + "' style='list-style-type:none'>" + p + "</ul>";

            alert(child);

            $("#sections").append(child);
        }
        //#endregion
    });