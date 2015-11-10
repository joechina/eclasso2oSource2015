define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
        var categories = ko.observableArray();

        var vm = {
            activate: activate,
            goexercise: goexercise,
            router: router,

            categories: global.categories,
        };

        shouter.subscribe(function (newValue) {
            activate();
            logger.log('reload exersize categories');
        }, this, "refresh_viewmodels/ex_main");

        return vm;

        //#region Internal Methods
        function activate() {
           
            $("#goback").css({ display: "none" });
            $("#refresh").css({ display: "inline" });

            logger.log('ex_main activated');
        }

        function goexercise() {
            router.navigate("/#exersize");
        }

        //#endregion

    });