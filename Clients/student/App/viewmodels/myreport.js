define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var exersizes = ko.observableArray();
        var exersize = ko.observable();
        var sections = ko.observableArray();
        var problem = ko.observable();
        var target = ko.observable();
        var answer = ko.observable();
        var ex = ko.observable();
        var user = ko.observable();

        var vm = {
            exersizes: exersizes,
            exersize: exersize,
            user:user,
            ex: ex,
            activate: activate,
            router: router,
            quiztypename: global.quiztypename,
            back: back,
        };

        return vm;

        function activate() {

            user(data.user());

            data.getuserexersizes_status(user().Id(), true).then(function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    exersizes.push(data.results[i].Exersize());
                }
            });

            ex.subscribe(function (newValue) {
                if (newValue != null) {
                    var eid = newValue.Id();

                    data.getexersize(eid).then(function (data) {
                        exersize(data.results[0]);
                    })
                }
            });

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "inline" });

        }

        function back() {
            router.navigateBack();
        }

    });