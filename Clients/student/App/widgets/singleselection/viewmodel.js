define(['durandal/composition', 'jquery', 'knockout', 'data'], function (composition, $, ko, data) {
    //var options = ko.observableArray();
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(null);
        this.isreporting = ko.observable(null);
        this.useranswer = ko.observable();

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
        useranswer = undefined;
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

        if(settings.isreporting) {
            this.isreporting(settings.isreporting);
            var uid = data.user().Id();
            var qid = settings.item.Id();
            data.getUserQuizzes(uid, qid).then(function (data) {
                if (data.results.length > 0) {
                    useranswer(data.results[0]);
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