define(['durandal/composition', 'jquery', 'knockout', 'data'], function (composition, $, ko, data) {
    var ctor = function () {
    }

    ctor.prototype.activate = function (settings) {
        this.settings = settings;
    };
    return ctor;
});