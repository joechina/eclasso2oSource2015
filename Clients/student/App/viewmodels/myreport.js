define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var exersizes = ko.observableArray();
        var ex_alter = ko.observableArray();
        var ex_reflets = ko.observableArray();
        var ex_saison = ko.observableArray();
        var exersize = ko.observable();
        var sections = ko.observableArray();
        var problem = ko.observable();
        var answer = ko.observable();
        var ex = ko.observable();
        var cat = ko.observable();
        var user = ko.observable();

        var vm = {
            ex_alter: ex_alter,
            ex_reflets:ex_reflets,
            exersize: exersize,
            user:user,
            ex: ex,
            activate: activate,
            router: router,
            quiztypename: global.quiztypename,
            categories: global.categories,
            cat: cat,
            openex:openex,
            back: back,

        };

        shouter.subscribe(function (newValue) {
            init();
            activate();
            logger.log('reload my report');
        }, this, "refresh_viewmodels/myreport");

        b_shouter.subscribe(function (newValue) {
            if (exersize()) {
                backtolist();
            }
            else
                back();

        }, this, "back_viewmodels/myreport");

        cat.subscribe(function (newValue) {
            if (exersizes().length != 0)
                exersizes.removeAll();

            switch (newValue) {
                case 0: // 0 - alter ego+
                    exersizes(ex_alter);
                    break;
                case 1: // 1 - reflets
                    exersizes(ex_reflets);
                    break;
                default:
                    exersizes(ex_saison);
                    break;
            }

        });

        ex.subscribe(function (newValue) {
            if (newValue != null) {
                var eid = newValue.Id();

                data.getexersize(eid).then(function (sd) {
                    var ex = sd.results[0];
                    data.keepExerciseSeq(ex);
                    exersize(ex);
                })
            }
        });

        return vm;

        function activate() {

            user(data.user());
            init();
                data.getuserexersizes_status(user().Id(), true).then(function (data) {
                    exersizes(data.results);
                    for (var i = 0; i < data.results.length; i++) {
                        var ex = data.results[i].Exersize();
                        if (ex.Category() == '0') {
                            ex_alter.push(ex);
                        }
                        else if (ex.Category() == '1') {
                            ex_reflets.push(ex);
                        }
                        else if (ex.Category() == '2') {
                            ex_saison.push(ex);
                        }
                    }
                });

                $("#goback").css({ display: "block" });
                $("#refresh").css({ display: "inline" });

        }

        function init() {
            exersize(undefined);
            ex(undefined);
            cat(undefined);
            ex_alter.removeAll();
            ex_reflets.removeAll();
            ex_saison.removeAll();
        }

        function openex(selected) {
            var eid = selected.Id();

            data.getexersize(eid).then(function (sd) {
                var ex = sd.results[0];
                data.keepExerciseSeq(ex);
                exersize(ex);
            })
        }

        function back() {
            router.navigate('/#me');
        }

        function backtolist() {
            exersize(undefined);
        }
    });