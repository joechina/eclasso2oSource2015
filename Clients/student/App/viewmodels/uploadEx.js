define(['plugins/router', 'knockout', 'data','logger','global'],
    function (router, ko, data, logger, global) {
        var audio = ko.observable();
        var text = ko.observable();
        var exercise = ko.observable();
        var vm = {
            activate: activate,
            //compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            audio: audio,
            exercise: exercise,
            text:text,
            global:global,
            addSection: addSection,
            deleteSection: deleteSection,
            deleteProblem: deleteProblem,
            deleteQuiz:deleteQuiz,
            addProblem: addProblem,
            addQuiz: addQuiz,
            uploadmedia: uploadmedia,
            uploadtext: uploadtext,
            uploadimage: uploadimage,
            init:init,
            cancel: cancel,
            quizTypes: [{ value: 0, label: '纯文本填空题' },
                        { value: 1, label: '单选题' },
                        { value: 2, label: '对错题' },
                        { value: 3, label: '多选题' },
                        { value: 4, label: 'html 填空题' },]
        };

        return vm;

        //#region Internal Methods
        function activate(eid) {
            if (eid == -1) {
                vm.exercise(data.create('Exersize'));
                $("#goback").css({ display: "block" });
                logger.log('upload Exersize activated');
            }
            else {
                vm.exercise(null);
                data.getexersize(eid).then(function (data) {
                    vm.exercise(data.results[0]);
                    var cur_eid = vm.exercise().Id();
                });
            }
            return true;
        }

        function init() {
            vm.exercise(null);

            logger.log('exersize reset');

            return true;
        }

        //function compositionComplete() {
        //    document.getElementById('mp3file').addEventListener("change", readFile, false);
        //}

        function uploadmedia(prob, file) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var resultdata = e.target.result;
                var newmedia = data.create('Media');
                newmedia.Content(resultdata);
                newmedia.Type('mp3');
                data.save(newmedia).then(function () {
                    prob.MediaId(newmedia.Id());
                    prob.Media(newmedia);

                    var audio = document.getElementById('audio');
                    audio.src = resultdata;
                });

            };
            FR.readAsDataURL(file);
        }

        function uploadimage(prob, file) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var resultdata = e.target.result;
                var newmedia = data.create('Media');
                newmedia.Content(resultdata);
                newmedia.Type('img');
                data.save(newmedia).then(function () {
                    prob.MediaId(newmedia.Id());
                    prob.Media(newmedia);
                    var pic = document.getElementById('image');
                    pic.src = resultdata;
                });

            };
            FR.readAsDataURL(file);
        }

        function uploadtext(prob) {
            var newmedia = data.create('Media');
            newmedia.Type('txt');
            newmedia.Content($("#txt").val());
            data.save(newmedia).then(function () {
                prob.MediaId(newmedia.Id());
                prob.Media(newmedia);
            });
        }

        function upload() {

            vm.exercise().Sections().forEach(function (s) {

                s.Problems().forEach(function (p) {

                    p.Quizzes().forEach(function (q) {
                        switch(q.QuizType())
                        {
                            case 0: //纯文本填空题
                                break;
                            case 1: //单选题
                                var d = [];
                                for (var j = 0; j < q.options().length; j++) {
                                    d.push(q.options()[j].text());
                                }
                                q.QuizDetail(d.join(','));

                                break;
                            case 2: //对错题
                                break;
                            case 3: //多选题
                                var d = [];
                                for (var j = 0; j < q.options().length; j++) {
                                    d.push(q.options()[j].text());
                                }
                                q.QuizDetail(d.join(','));
                                break;
                            case 4: // html 填空题
                                break;
                        }
                    })
                })                
            });

            data.save(vm.exercise()).then(function () {
                alert('习题已保存');
                init();
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    logger.log(err[i]);
                }
            });            
        }

        function addProblem(sec) {
            var newprob = data.create('Problem');
            //newprob.ExersizeSection(sec);
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
            //newsec.Exersize(exec);
            exec.Sections.push(newsec);
        }

        function addQuiz(prob) {
            var newquiz = data.create('Quiz');
            //newquiz.Problem(prob);
            prob.Quizzes.push(newquiz);
        }
        
        function cancel() {
            init();
            router.navigateBack();
        }
        //#endregion
    });