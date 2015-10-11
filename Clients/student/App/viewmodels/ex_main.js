define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var categories = ko.observableArray();

        var vm = {
            activate: activate,
            openexersize: openexersize,
            router: router,

            categories: [
                { value: 0, label: 'Alter Ego+', image: '../../Content/images/alter-ego[2].jpg' },
                { value: 1, label: 'Reflets', image: '../../Content/images/reflets.jpg' },
                { value: 2, label: 'Saison', image: '../../Content/images/logo.png' }
            ]
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

        function openexersize(selected) {
            router.navigate("/#exersize");
        }

        //#endregion

    });