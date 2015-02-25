define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var problem = ko.observable();
        var vm = {
            problem: problem,
            activate: activate,
            submitanswer:submitanswer,
            router: router,
            backtolist: backtolist,
            quiztypename: quiztypename
        };

        return vm;

        //#region Internal Methods
        function activate(id) {
            data.getproblem(id).then(function (pdata) {
                var p = pdata.results[0];
                if (p.MediaId() > 0) {
                    data.getmedia(p.MediaId()).then(function (mdata) {
                        p.Media(mdata.results[0]);
                        problem(p);
                    })
                }
            });
            logger.log('problem activated');
        }
        
        function quiztypename(id) {
            switch (id) {
                case 0:
                    return 'fillblank';
                    break;
                case 1:
                    break;
            }
        }
        function backtolist() {
            exersize(undefined);
        }

        function submitanswer() {
            alert('confirm an answer');
            router.navigateBack();
        }
        //#endregion
    });