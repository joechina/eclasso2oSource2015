define(['durandal/composition', 'jquery', 'knockout', 'data', 'global'], function (composition, $, ko, data) {
    var ctor = function () {
        var self = this;
        this.isediting = ko.observable(false);
        this.Media = ko.observable();
    }

    ctor.prototype.activate = function (settings) {
        var self = this;
        this.settings = settings;
        if (settings.item.MediaId()) {
            return data.getMedia(settings.item.MediaId()).then(function(mdata){
                self.Media(mdata.results[0]);
            });
        }
        else {
            self.Media(undefined);
            return true;
        }
    };

    return ctor;
});