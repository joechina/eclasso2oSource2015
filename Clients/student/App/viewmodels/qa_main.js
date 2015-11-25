define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var qa_cat = ko.observableArray();

        var vm = {
            activate: activate,
            router: router,

            qa_cat: global.qa_cat,
        };

        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload qa categories');
        }, this, "refresh_viewmodels/qa_main");

        return vm;

        //#region Internal Methods
        function activate() {

            $("#goback").css({ display: "none" });
            $("#refresh").css({ display: "none" });

            logger.log('qa_main activated');
        }

        function goqa() {
            router.navigate("/#exersize");
        }

        //#endregion

    });