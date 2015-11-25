define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var question = ko.observable();
        var questions = ko.observableArray();
        var search = ko.observable();

        var login = {
            question: question,
            questions:questions,
            activate: activate,
            openanswer: openanswer,
            router: router,
            backtolist: backtolist,
            searchAnswers: searchAnswers,
            displayquestions: ko.computed(function () {
                var str = search();
                if (!str || str.replace(/\s/g, "") == "") {
                    return questions();
                }
                else
                {
                    return ko.utils.arrayFilter(questions(), function (q) {
                        return q.QuestionDetail().indexOf(str) > -1;
                    });
                }
            }),
            search: search,
            clearsearch: function () {
                search('');
            },

        };

        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload QA');
        }, this, "refresh_viewmodels/question");

        b_shouter.subscribe(function (newValue) {
            if (question()) {
                backtolist();
            }
            else {
                router.navigate('/#qa_main');
            }

        }, this, "back_viewmodels/question");

        return login;

        //#region Internal Methods
        function activate(cat) {
            //var questionid = parseInt(id)
            //if (questionid > 0)

            questions.removeAll();

            data.getquestions(cat).then(function (data) {
                questions(data.results);
            });
            
            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "inline" });

            logger.log('question activated');
        }

        function openanswer(selected) {
            question(selected);

            //$("#main_title").css({ float: "left", position: "relative" });

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });
        }

        function backtolist() {
            question(undefined);

            //$("#main_title").css({ float: "center", position: "absolute" });

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "inline" });

            //router.navigateBack();
        }

        function searchAnswers (q) {
            data.searchQuestion(q).then (function (data) {
                answers(data.results);
            })
        }

        function askQuestion(Class, question, okFunc, errFunc) {
            setTimeout(okFunc, 3000);
        };
        //#endregion
    });