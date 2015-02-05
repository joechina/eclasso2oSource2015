define(['plugins/router', 'knockout', 'data','logger'],
    function (router, ko, data, logger) {
        var audio = ko.observable();
        var vm = {
            activate: activate,
            compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            audio: audio
        };

        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('input activated');
            return true;
        }

        function compositionComplete() {
            document.getElementById('mp3file').addEventListener("change", readFile, false);
        }

        function readFile() {
            if (this.files && this.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e) {
                    var resultdata = e.target.result;
                    audio(resultdata);
                };
                FR.readAsDataURL(this.files[0]);
            }
        }

        function upload() {
            //Save to Server
            Alert('Need to add logic to store the data to server');
        }

        //#endregion
    });