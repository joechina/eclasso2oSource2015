define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var msg = ko.observable();
        var classes = ko.observableArray();        
       
        var vm = {
            msg: msg,
            classes: classes,
            activate: activate,
            router: router,
            back: back,
            send: send,
        };

        return vm;

        function activate() {
            vm.msg = data.create('Announcement');
            vm.msg.CreateDate(new Date());

            data.getClasses().then(function(data){
                classes(data.results);
            });
           
            logger.log('new msg activated');
            return true;
        }

        function back() {
            router.navigateBack();
        }

        function send() {

            data.save(vm.msg).then(function () {
                Alert('Message sent');

            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });

            // relate a message to current user            
            var userMsg = data.create("UserAnnouncement");
            
            data.getUser().then(function (data) {
                var user = data.results[0];                
                userMsg.UserId(user.Id());
            });
            
            userMsg.AnnouncementId(vm.msg.Id());
            
            data.save(userMsg).then(function () {
                Alert('User Announcement saved');

            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });            
        }
    
    });