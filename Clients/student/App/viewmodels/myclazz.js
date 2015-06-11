define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var userclazzes = ko.observableArray();
        var clazzes = ko.observableArray();
        var clazz = ko.observable();
        var teacher = ko.observable();
        //var students = ko.observableArray();
        //var teachers = ko.observableArray();

        var vm = {
            clazzes: clazzes,
            clazz: clazz,
            userclazzes:userclazzes,
            activate: activate,
            quitclazz: quitclazz,
            router: router,
        };

        return vm;

        //#region Internal Methods
        function activate() {
            if (clazzes().length == 0) {
                var uid = data.user().Id();
                data.getUserClasses(uid).then(function (result) {
                    userclazzes(result.results);

                    for (i = 0; i < userclazzes().length; i++) {
                        var cid = userclazzes()[i].ClassId();
                        data.getClass(cid).then(function (result) {
                            var c = result.results[0];
                            var tid = c.TeacherId();
                            data.getuser(tid).then(function (data) {
                                var s = data.results[0].Name();
                                c.teacher = s;

                                clazzes.push(c);
                            });

                        });
                    }
                });
            }
            
            $("#goback").css({ display: "block" });
            logger.log('my clazzes activated');
        }

        function quitclazz(selected) {
            clazz(selected);

            // TODO: delete this record from UserClasses table
        }

        //#endregion
    });