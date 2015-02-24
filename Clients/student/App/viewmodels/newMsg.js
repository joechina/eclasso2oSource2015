define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var msg = ko.observable();
       
        var vm = {
            msg: msg,
            activate: activate,
            router: router,
            back: back,
            send:send

        };

        return vm;

        function activate() {
            vm.announcement=data.create('Announcement');

            logger.log('new msg activated');
            return true;
        }

        function back() {
            router.navigate('/#announcements');
        }

        function send() {

        }
    
    });