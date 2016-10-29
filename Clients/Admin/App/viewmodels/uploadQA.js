define(['plugins/router', 'knockout', 'data', 'logger', 'global'],
    function (router, ko, data, logger, global) {
       
       
        var vm = {
            activate: activate,
            //compositionComplete: compositionComplete,
            upload: upload,
            uploadimage:uploadimage,
            router: router,
            global: global,
            back: back,
            reset:reset
        };

        return vm;

        //#region Internal Methods
        function activate() {
            vm.question = data.create('Question');

            logger.log('upload QA activated');
            return true;
        }

        //function compositionComplete() {
        //    document.getElementById('mp3file').addEventListener("change", readFile, false);
        //}

        function upload() {
            vm.question.Create(new Date());

            data.save(vm.question).then(function () {
                alert('QA Uploaded. Please check database');

            }).fail(function (err) {
                for (var i = 0; i < err.length; i++) {
                    alert(err[i]);
                    logger.log(err[i]);
                }
            });
        }

        function uploadimage(file) {
            var FR = new FileReader();
            FR.onload = function (e) {
                vm.question.Image(e.target.result);
            };
            FR.readAsDataURL(file);
        }
        
        function back() {
            router.navigate('/#msgQA');
        }

        function reset() {
            document.getElementById('title').setValue('');
        }
        //#endregion
    });