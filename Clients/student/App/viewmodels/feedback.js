define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var feedback = ko.observable();
        var category = ko.observable();
        var categories = ko.observableArray();
        var today = ko.observable();

        var vm = {
            feedback: feedback,
            activate: activate,
            today: today,
            router: router,
            category: category,
            send: send,
            categories: ['通知', '习题', 'Q&A','其它'],
        };

        b_shouter.subscribe(function (newValue) {
            back();
        }, this, "back_viewmodels/feedback");
        return vm;

        function activate() {

            feedback(data.create('Feedback'));

            feedback().CreateDate(new Date());
            var year = feedback().CreateDate().getFullYear();
            var month = feedback().CreateDate().getMonth() + 1; //getMonth()	从 Date 对象返回月份 (0 ~ 11)。
            var day = feedback().CreateDate().getDate();
            today(year + ' 年 ' + month + ' 月 ' + day + ' 日');

            $("#goback").css({ display: "block" });
            $("#refresh").css({ display: "none" });

            logger.log('feedback activated');
            return true;
        }

        function send() {
            feedback().UserId(data.user().Id());
            data.save(feedback()).then(function () {
                alert('Feedback sent');
                router.navigate('/#announcements')
            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });
        }

        function back() {
            router.navigateBack();
        }
    });