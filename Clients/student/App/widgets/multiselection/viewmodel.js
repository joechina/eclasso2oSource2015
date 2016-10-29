define(['durandal/composition', 'jquery', 'knockout', 'data','logger'], function (composition, $, ko, data,logger) {
    //var options = ko.observableArray();
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(null);
        this.isreporting = ko.observable(null);
        this.useranswer = ko.observableArray();
        this.useranswertxt = ko.observable();

        //this.options = options;
        this.addoptions = function () {
            var newoption = {text:ko.observable()};
            self.settings.item.options.push(newoption);
        }

        this.deleteoption = function (o) {
            self.settings.item.options.remove(o);
        }

        this.compositionComplete = function () {
            $('input[type="checkbox"]').on('change', function (e) {
                if (self.useranswer().length)
                    data.user().userquizanswers[self.settings.item.Id()] = self.useranswer().sort().join(', ');
                else
                    data.user().userquizanswers[self.settings.item.Id()] = "";
            });
        }
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;

        var details = settings.item.QuizDetail();
        if (details && settings.item.options().length === 0) {
            settings.item.options( details.split(','));
        }
        //settings.item.options = options;
        if (settings.isediting != null) {
            this.isediting(settings.isediting);
        }

        var qid = settings.item.Id();
        if (settings.isreporting != null && settings.isreporting) {
            this.isreporting(settings.isreporting);
            this.filledTxt("无回答");

            if (data.user().userquizanswers[qid] == null) {
                var a = this
                var uid = data.user().Id();
                data.getUserQuizs(uid, qid).then(function (result) {
                    if (result.results.length > 0) {
                        data.user().userquizanswers[qid] = result.results[0].Answer();
                        a.useranswertxt(result.results[0].Answer());
                        logger.log(a.useranswertxt());
                    }
                    else
                        data.user().userquizanswers[qid] = "";
                }).fail(function (err) {
                    alert(err.message);
                });
            }
            else if (data.user().userquizanswers[qid] != "")
                this.useranswertxt(data.user().userquizanswers[qid]);
        }
        else if (data.user().userquizanswers[qid] != null)
            this.useranswer(data.user().userquizanswers[qid].split(", "));
        
    };
    

    
    return ctor;
});