define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var audio = ko.observable();
        var text = ko.observable();
        var exercise = ko.observable();
        var cat = ko.observable();

        var vm = {
            activate: activate,
            //compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            audio: audio,
            exercise: exercise,
            text: text,
            cat: cat,
            global: global,
            addSection: addSection,
            deleteSection: deleteSection,
            deleteProblem: deleteProblem,
            deleteQuiz: deleteQuiz,
            addProblem: addProblem,
            addQuiz: addQuiz,
            uploadmedia: uploadmedia,
            uploadtext: uploadtext,
            uploadimage: uploadimage,
            init: init,
            cancel: cancel,
            categories: [{ value: 0, label: 'Alter Ego+' },
                          {value: 1, label: '简易问答题' },
                          { value: 2, label: 'Festival' },
                           { value: 3, label: 'Reflets' }],
            quizTypes: [{ value: 0, label: '纯文本填空题' },
                        { value: 1, label: '单选题' },
                        { value: 2, label: '对错题' },
                        { value: 3, label: '多选题' },
                        { value: 4, label: 'html 填空题' }, ]
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
                return data.getexersize(eid).then(function (sd) {
                    var ex = sd.results[0];
                    data.keepExerciseSeq(ex);
                    vm.exercise(ex);
                    var cur_eid = vm.exercise().Id();
                });
            }
            //return true;
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
                        switch (q.QuizType()) {
                            case 0: //纯文本填空题
                                break;
                            case 1: //单选题
                                var d = [];
                                for (var j = 0; j < q.options().length; j++) {
                                    if (q.options()[j].text) {
                                        d.push(q.options()[j].text());
                                    }
                                    //else if (q.options()[j].text()) {
                                    //    d.push(q.options()[j].text());
                                    //}
                                }
                                q.QuizDetail(d.join(','));

                                break;
                            case 2: //对错题
                                break;
                            case 3: //多选题
                                var d = [];
                                for (var j = 0; j < q.options().length; j++) {
                                    if (q.options()[j].text) {
                                        d.push(q.options()[j].text);
                                    }
                                    else if (q.options()[j].text()) {
                                        d.push(q.options()[j].text());
                                    }
                                }
                                q.QuizDetail(d.join(','));
                                break;
                            case 4: // html 填空题
                                break;
                        }
                    })
                })
            });

            switch (cat()) {
                case 'Alter Ego+':
                    exercise().Category(0);
                    break;
                case 'Reflets':
                    exercise().Category(1);
                    break;
                case 'Saison':
                    exercise().Category(2);
                    break;

            }


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
            newprob.Seq(sec.Problems().length);
            //newprob.ExersizeSection(sec);
            sec.Problems.push(newprob);
        }

        function deleteProblem(prob) {
            var seq = prob.Seq();
            prob.ExersizeSection().Problems.remove(prob);
            prob.ExersizeSection().Problems().forEach(function (p) {
                if (p.Seq() > seq) {
                    p.Seq(p.Seq() - 1);
                }
            });
            prob.entityAspect.setDeleted();
        }

        function deleteSection(sec) {
            var seq = sec.Seq();
            sec.Exersize().Sections.remove(sec);
            sec.Exersize().Sections().forEach(function (s) {
                if (s.Seq() > seq) {
                    s.Seq(s.Seq() - 1);
                }
            })
            sec.entityAspect.setDeleted();
        }

        function deleteQuiz(quiz) {
            var seq = quiz.Seq();
            quiz.Problem().Quizzes.remove(quiz);
            quiz.Problem().Quizzes().forEach(function (q) {
                if (q.Seq() > seq) {
                    q.Seq(q.Seq() - 1);
                }
            })
            quiz.entityAspect.setDeleted();
        }

        function addSection(exec) {
            var newsec = data.create('ExersizeSection');
            newsec.Seq(exec.Sections().length);
            //newsec.Exersize(exec);
            exec.Sections.push(newsec);
        }

        function addQuiz(prob) {
            var newquiz = data.create('Quiz');
            newquiz.Seq(prob.Quizzes().length);
            //newquiz.Problem(prob);
            prob.Quizzes.push(newquiz);
        }

        function cancel() {
            init();
            router.navigateBack();
        }
        //#endregion
    });