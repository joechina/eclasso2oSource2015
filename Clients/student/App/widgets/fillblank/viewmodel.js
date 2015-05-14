define(['durandal/composition', 'jquery', 'knockout', 'data', 'global'], function (composition, $, ko, data) {
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(false);
        this.isreporting = ko.observable(false);
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        if (!this.settings.item.answer) {
            this.settings.item.answer = ko.observable();
        }
        if (settings.isediting) {
            this.isediting(settings.isediting);
        }
        if (settings.isreporting) {
            this.isreporting(settings.isreporting);
        }
    };

    return ctor;
});