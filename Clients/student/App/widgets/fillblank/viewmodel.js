define(['durandal/composition', 'jquery', 'knockout', 'data', 'global'], function (composition, $, ko, data) {
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(false);
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;
        if (settings.isediting) {
            this.isediting(settings.isediting);
        }
    };
    return ctor;
});