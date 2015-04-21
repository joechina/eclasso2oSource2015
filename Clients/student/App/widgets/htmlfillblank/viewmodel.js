define(['durandal/composition', 'jquery', 'knockout', 'data', 'global'], function (composition, $, ko, data) {
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(false);
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        if (!this.settings.item.answer) {
            this.settings.item.answer = ko.observable(this.settings.item.Challenge());
        }
        else
            this.settings.item.answer(this.settings.item.Challenge());

        if (settings.isediting) {
            this.isediting(settings.isediting);
        }
    };

    return ctor;
});