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

        return login;

        //#region Internal Methods
        function activate(id) {
            //var questionid = parseInt(id)
            //if (questionid > 0)
            data.getquestions().then(function (data) {
                questions(data.results);
            });

            $("#goback").css({ display: "none" });
            logger.log('question activated');
        }

        function openanswer(selected) {
            question(selected);
            
        }

        function backtolist() {
            question(undefined); 
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