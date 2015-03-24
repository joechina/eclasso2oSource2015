define(['durandal/composition', 'jquery', 'knockout', 'data'], function (composition, $, ko, data) {
    //var options = ko.observableArray();
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(false);
        //this.options = options;
        this.addoptions = function () {
            var newoption = {text:ko.observable('new option')};
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
            var detailbd = details.split(',');
            for (var i = 0; i < detailbd.length; i++) {
                var o = {};
                o.text = detailbd[i];
                settings.item.options.push(o);
            }
        }
        //settings.item.options = options;
        if (settings.isediting) {
            this.isediting(settings.isediting);
        }
        
    };

    ctor.prototype.compositionComplete = function () {
        var choice = "";
        $('input[type="radio"]').on('click change', function(e) {
            choice= e.target.value;
        });

        if (this.settings.answer !=null)
            this.settings.answer(choice);
    }
    return ctor;
});