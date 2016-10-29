define(['durandal/composition', 'jquery', 'knockout', 'data', 'global'], function (composition, $, ko, data) {
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(null);
        this.isreporting = ko.observable(null);
        this.filledTxt = ko.observable();
        this.isInit = false;

        this.filledTxt.subscribe(function (newValue) {
            if (this.isInit)
                return;
            data.user().userquizanswers[this.settings.item.Id()] = newValue;
            //this.settings.to_next();
        }, this);
    }

    ctor.prototype.activate = function (settings) {
        this.isInit = true;
        this.settings = settings;
        var qid = this.settings.item.Id();
        if (data.user().userquizanswers[qid] != null && data.user().userquizanswers[qid] != "")
            this.filledTxt(data.user().userquizanswers[qid]);
        this.isInit = false;

        if (settings.isediting != null) {
            this.isediting(settings.isediting);
        }
        if (settings.isreporting && settings.isreporting) {
            this.isreporting(settings.isreporting);
            if (this.filledTxt() == null)
                this.filledTxt("无回答");
            if (data.user().userquizanswers[qid] == null) {
                var uid = data.user().Id();;
                var a = this;
                data.getUserQuizs(uid, qid).then(function (result) {
                    if (result.results.length > 0) {
                        data.user().userquizanswers[qid] = result.results[0].Answer();
                        a.filledTxt(result.results[0].Answer());
                    }
                    else {
                        data.user().userquizanswers[qid] = "";
                    }
                }).fail(function (err) {
                    alert(err.message);
                });
            }

        }
    };

    return ctor;
});