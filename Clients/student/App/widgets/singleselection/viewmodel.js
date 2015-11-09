define(['durandal/composition', 'jquery', 'knockout', 'data', 'logger'], function (composition, $, ko, data, logger) {
    //var options = ko.observableArray();
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(null);
        this.isreporting = ko.observable(null);
        this.useranswer = ko.observable("");
        this.isChecked = ko.computed({
            read: function () {
                return  self.useranswer();
            },
            write: function (newValue) {
                data.user().userquizanswers[self.settings.item.Id()] = newValue;
                if (self.useranswer() != newValue)
                    self.useranswer(newValue);
            }
        });
        this.isInit = false;
        this.answercolor = ko.computed(function () {
            if (self.isreporting() != null && self.isreporting()) {
                if (self.useranswer() == self.settings.item.Answer())
                    return "green";
                else
                    return "red";
                return "black";
            }
        });

        //this.options = options;
        this.addoptions = function () {
            var newoption = {text:ko.observable()};
            self.settings.item.options.push(newoption);
        }
        this.deleteoption = function (o) {
            self.settings.item.options.remove(o);
        }
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;

        var details = settings.item.QuizDetail();
        if (details && settings.item.options().length===0) {
            settings.item.options(details.split(','));
        }

        //settings.item.options = options;
        if (settings.isediting != null && (settings.isreporting == null || settings.isreporting == false)) {
            this.isediting(settings.isediting);
        }

        var qid = settings.item.Id();
        if (settings.isreporting != null && settings.isreporting) {
            this.isreporting(settings.isreporting);
            this.useranswer("无回答");
            if (data.user().userquizanswers[qid] == null) {
                var a = this;
                var uid = settings.uid;
                data.getUserQuizs(uid, qid).then(function (result) {
                    if (result.results.length > 0) {
                        data.user().userquizanswers[qid] = result.results[0].Answer();
                        a.useranswer(result.results[0].Answer());
                        logger.log(result.results[0].Answer());
                    }
                    else
                        data.user().userquizanswers[qid] = "";
                }).fail(function (err) {
                    alert(err.message);
                });
            }
            else if (data.user().userquizanswers[qid] != "")
                this.useranswer(data.user().userquizanswers[qid]);
        }
        else if (data.user().userquizanswers[qid] != null)
            this.useranswer(data.user().userquizanswers[qid]);

    };

    //ctor.prototype.compositionComplete = function () {
    //    var choice = "";
    //    $('input[type="radio"]').on('click change', function(e) {
    //        choice= e.target.value;
    //    });

    //    if (this.settings.answer !=null)
    //        this.settings.answer(choice);
    //}
    return ctor;
});