define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var exersize = ko.observable();
        var exersizes = ko.observableArray();

        var doneexersize = ko.observable();
        var doneexersizes = ko.observableArray();

        var login = {
            exersize: exersize,
            exersizes: exersizes,
            activate: activate,
            openexersize: openexersize,
            submit:submit,
            router: router,
            backtolist: backtolist
        };

        return login;

        //#region Internal Methods
        function activate(uid) {
            //get exersizes assigned to a user
            if (!exersize()) {
                data.getuserexersizes(uid).then(function (data) {
                    exersizes(data.results);
                });
            }
            

            $("#goback").css({ display: "none" });

            logger.log('exersizes activated');
        }

        function openexersize(selected) {
            exersize(selected);
            /*
            var id = selected.ExersizeId();
            data.getexersize(id).then(function (data) {
                exersize(data.results[0]);
            });
            */
        }

        function backtolist() {
            exersize(undefined);
        }

        function submit(ex) {
            var uid = data.user().Id();
            var eid = ex.Id();
            data.getuserexersize(uid, eid).then(function (result) {
                if (result.results.length == 0) {//if not exist, create a new record
                    var ue = data.create('UserExersize');
                    ue.UserId(uid);
                    ue.ExersizeId(eid);
                    ue.Completed('true');

                    data.save(ue).then(function () {
                        alert('习题: ' + eid + '已提交');
                        logger.log('学生: ' + uid + '习题: ' + eid + '已提交');

                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                
                }
                else {// if record exists, update the Completed field
                    result.results[0].Completed('true');

                    data.save(result.results[0]).then(function () {
                        alert('习题: ' + eid + '已提交');
                        logger.log('学生: ' + uid + '习题: ' + eid + '已提交');

                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                }
            })
        }

        //#endregion
    });