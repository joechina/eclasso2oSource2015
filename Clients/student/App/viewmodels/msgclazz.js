﻿define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazzes = ko.observableArray();
        var clazz = ko.observable();
        var students = ko.observableArray();
        var teachers = ko.observableArray();
        var selectedUsers = ko.observableArray();
        var showclazz = ko.observable(false);
        var vm = {
            clazzes: clazzes,
            clazz: clazz,
            students: students,
            teachers: teachers,
            selectedUsers: selectedUsers,
            showclazz: showclazz,
            activate: activate,
            openclazz: openclazz,
            delclazz: delclazz,
            editclazz: editclazz,
            router: router,
            backtolist: backtolist,
            newclazz: newclazz,
            save: save,
        };

        var self = vm;
        return vm;

        //#region Internal Methods
        function activate() {
            data.getClasses().then(function (data) {
                clazzes(data.results);
            });

            $("#goback").css({ display: "block" });
            logger.log('clazzes activated');
        }

        function openclazz(selected) {
            clazz(selected);
            $("#goback").css({ display: "block" });
            return true;
        }

        function newclazz() {
            router.navigate('/#newclazz');
        }

        function editclazz() {
            selectedUsers([]);
            clazz().Users().forEach(function (user) {
                selectedUsers.push(user.UserId().toString());
            });
            data.getTeachers().then(function (data) {
                teachers(data.results);
            });
            data.getStudents().then(function (data) {
                students(data.results);
            });
            showclazz(true);
        }

        function delclazz() {
            var class_id = clazz().Id();
        }

        function save() {
            var cid = clazz().Id();

            /*var user_list = selectedUsers().sort(function (a, b) {
                return a - b;
            });
            */

            for (i = 0; i < selectedUsers().length; i++) {
                var uid = selectedUsers().Id();
                data.getUserClass(uid, cid).then(function (result) {

                    var uc = result.results[0];

                    data.save(clazz()).then(function () {
                        logger.log('saved user class');
                    }).fail(function (err) {
                        for (var i = 0; i < err.length; i++) {
                            logger.log(err[i]);
                        }
                    });
                });

            }
            backtolist();
        }

        function backtolist() {
            showclazz(false);
            clazz(null);
            //router.navigateBack();
        }

        //#endregion
    });