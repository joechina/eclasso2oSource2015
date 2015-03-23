define(['durandal/composition', 'jquery', 'knockout', 'data'], function (composition, $, ko, data) {
    var options = ko.observableArray();
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(false);
        this.options = options;
        this.addoptions = function () {
            var newoption = { text: ko.observable('new option') };
            options.push(newoption);
        }
        this.deleteoption = function (o) {
            options.remove(o);
        }
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        var details = settings.item.QuizDetail();
        if (details) {
            var detailbd = details.split(',');
            for (var i = 0; i < detailbd.length; i++) {
                var o = {};
                o.text = detailbd[i];
                options.push(o);
            }
        }
        settings.item.options = options;
        if (settings.isediting) {
            this.isediting(settings.isediting);
        }
    };
    return ctor;
});