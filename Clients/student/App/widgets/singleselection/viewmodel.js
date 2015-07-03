define(['durandal/composition', 'jquery', 'knockout', 'data', 'logger'], function (composition, $, ko, data, logger) {
    //var options = ko.observableArray();
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(null);
        this.isreporting = ko.observable(null);
        this.useranswer = ko.observable("");
        this.isChecked = ko.observable();

        //this.options = options;
        this.addoptions = function () {
            var newoption = {text:ko.observable()};
            self.settings.item.options.push(newoption);
        }
        this.deleteoption = function (o) {
            self.settings.item.options.remove(o);
        }

        this.isChecked.subscribe(function (newValue) {
            this.settings.item.answer(newValue);
            this.settings.to_next();
        }, this);
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;

        if (!this.settings.item.answer) {
            this.settings.item.answer = ko.observable();
        }

        var details = settings.item.QuizDetail();
        if (details && settings.item.options().length===0) {
            var detailbd = details.split(',');
            for (var i = 0; i < detailbd.length; i++) {
                var o = {};
                o.text = detailbd[i];
                settings.item.options.push(o);
            }
        }

        //settings.item.options = options;
        if (settings.isediting !=null) {
            this.isediting(settings.isediting);
        }

        if (settings.isreporting) {
            this.isreporting(settings.isreporting);

            var uid = settings.uid;
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