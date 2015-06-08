define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var msg = ko.observable();
        var target = ko.observable();
        var classes = ko.observableArray();        
        //var users = ko.observableArray();
        var teachers = ko.observableArray();
        var isHighPriority = ko.observable(false);
        var today = ko.observable();

        var vm = {
            msg: msg,
            classes: classes,
            activate: activate,
            today:today,
            router: router,
            target:target,
            back: back,
            send: send,
            save:save,
            targets: ['所有班级', '我的班级', '老师'],
            isHighPriority:isHighPriority
        };

        return vm;

        function activate() {
            vm.msg(data.create('Announcement'));
            today(new Date());
            
            data.getClasses().then(function(data){
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

        function send() {
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
                    for(i = 0; i< users().length; i++) {
                        var usermsg = data.create('UserAnnouncement');
                        usermsg.UserId(users()[i].Id());
                        usermsg.AnnouncementId(newmsg.Id());
                        usermsg.HighPriority(isHighPriority());
                        newmsg.Users.push(usermsg);
                    }
                    break;
            }
            newmsg.Draft('0');

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

        function save() {
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

            newmsg.Draft('1');

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