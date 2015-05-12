define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazzes = ko.observableArray();
        var clazz = ko.observable();
        var students = ko.observableArray();
        var student = ko.observable();
        var teachers = ko.observableArray();
       
        var vm = {
            clazzes: clazzes,
            clazz:clazz,
            students: students,
            student:student,
            teachers:teachers,
            activate: activate,
            openclazz: openclazz,
            delclazz: delclazz,
            editclazz:editclazz,
            router: router,
            backtolist: backtolist,
            newclazz:newclazz
        };

        return vm;

        //#region Internal Methods
        function activate(id) {

            data.getClasses().then(function (data) {
                clazzes(data.results);
            });

            $("#goback").css({ display: "none" });
            logger.log('clazzes activated');
        }

        function openclazz(selected) {
            clazz(selected);

            $("#goback").css({ display: "block" });
        }

        function backtolist() {
            clazz(undefined);
            //router.navigateBack();
        }

        function newclazz() {
            router.navigate('/#newclazz');
        }

        function delclazz() {

        }

        function editclazz() {
            router.navigate('/#editclazz');
        }
        //#endregion
    });