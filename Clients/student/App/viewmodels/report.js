define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var clazz = ko.observable();
        var classes = ko.observableArray();
        var student = ko.observable();
        var students = ko.observableArray();
        var excersizes = ko.observableArray();
        var sections = ko.observableArray();
        var quizs = ko.observableArray();

        var vm = {
            exersizes: exersizes,
            classes: classes,
            activate: activate,
            router: router,
            back: back,
            save: save,

        };

        return vm;

        function activate() {

            data.getClasses().then(function (data) {
                classes(data.results);
            });

            data.getTeachers().then(function (data) {
                teachers(data.results);
            })

            vm.targetDetails = ko.computed(function () {
                switch (vm.msg().Target()) {
                    case '我的班级':
                        return classes();
                    case '老师':
                        return teachers();
                        break;
                    default:
                        return [];
                }
            });

            $("#goback").css({ display: "none" });

            logger.log('new msg activated');
            return true;
        }

        function back() {
            router.navigateBack();
        }

        function save2Word() {
            var newmsg = vm.msg();
            switch (newmsg.Target()) {
                case '我的班级':
                    var c = target();
                    for (var i = 0; i < c.Users().length; i++) {
                        var usermsg = data.create('UserAnnouncement');
                        usermsg.UserId(c.Users()[i].UserId());
                        usermsg.AnnouncementId(newmsg.Id());
                        usermsg.HighPriority(isHighPriority());
                        newmsg.Users.push(usermsg);
                    }
                    break;
                case '老师':
                    var tid = target().Id();
                    newmsg.Target(newmsg.Target() + '-' + tid);
                    var usermsg = data.create('UserAnnouncement');
                    usermsg.UserId(tid);
                    usermsg.AnnouncementId(newmsg.Id());
                    usermsg.HighPriority(isHighPriority());
                    newmsg.Users.push(usermsg);
                    break;
                default:
                    for (i = 0; i < users().length; i++) {
                        var usermsg = data.create('UserAnnouncement');
                        usermsg.UserId(users()[i].Id());
                        usermsg.AnnouncementId(newmsg.Id());
                        usermsg.HighPriority(isHighPriority());
                        newmsg.Users.push(usermsg);
                    }
                    break;
            }
            data.save(newmsg).then(function () {
                alert('Message sent');
                router.navigate('/#announcements')
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });

        }

    });