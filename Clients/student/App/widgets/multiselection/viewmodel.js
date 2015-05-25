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
        if (settings.isediting != null) {
            this.isediting(settings.isediting);
        }

        if (settings.isreporting != null) {
            this.isreporting(settings.isreporting);
        }
        
    };
    
    ctor.prototype.compositionComplete = function () {
        $('input[type="checkbox"]').on('click change', function (e) {
            this.settings.item.answer.push(e.target.value);
        });
    }
    
    return ctor;
});