define(['durandal/composition', 'jquery', 'knockout', 'data', 'global'], function (composition, $, ko, data) {
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(null);
        this.isreporting = ko.observable(null);
        this.useranswer = ko.observable();
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        if (!this.settings.item.answer) {
            this.settings.item.answer = ko.observable(this.settings.item.Challenge());
        }
        else
            this.settings.item.answer(this.settings.item.Challenge());

        if (settings.isediting != null) {
            this.isediting(settings.isediting);
        }

        if (settings.isreporting) {
            this.isreporting(settings.isreporting);
            var uid = data.user().Id();
            var qid = settings.item.Id();
            data.getUserQuizs(uid, qid).then(function (data) {
                if (data.results.length > 0) {
                    settings.item.answer(data.results[0].Answer());
                    logger.log(settings.item.answer());
                }
                else {
                    settings.item.answer("无回答");
                }
            }).fail(function (err) {
                alert(err.message);
            });

        }
    };

    return ctor;
});