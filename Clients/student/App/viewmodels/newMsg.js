define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var msg = ko.observable();
        var classes = ko.observableArray();        
        var users = ko.observableArray();
        var target = ko.observable();
        var isHighPriority = ko.observable(false);
        var vm = {
            msg: msg,
            classes: classes,
            activate: activate,
            router: router,
            back: back,
            send: send,
            targets: ['所有人', '班级', '个人'],
            target: target,
            isHighPriority:isHighPriority
        };

        return vm;

        function activate() {
            vm.msg(data.create('Announcement'));
            vm.msg().CreateDate(new Date());

            data.getClasses().then(function(data){
                classes(data.results);
            });
            
            data.getUsers().then(function (data) {
                users(data.results);
            })

            vm.targetDetails = ko.computed(function () {
                switch (vm.msg().Target()) {
                    case '班级':
                        return classes();
                    case '个人':
                        return users();
                        break;
                    default:
                        return [];
                }
            });

            logger.log('new msg activated');
            return true;
        }

        function back() {
            router.navigateBack();
        }

        function send() {
            var newmsg = vm.msg();
            switch (newmsg.Target()) {
                case '班级':
                    var c = target();
                    for (var i = 0; i < c.Users().length; i++) {
                        var usermsg = data.create('UserAnnouncement');
                        usermsg.UserId(c.Users()[i].UserId());
                        usermsg.AnnouncementId(newmsg.Id());
                        usermsg.HighPriority(isHighPriority());
                        newmsg.Users.push(usermsg);
                    }
                    break;
                case '个人':
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
            data.save(newmsg).then(function () {
                alert('Message sent');
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });

        }
    
    });