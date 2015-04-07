define(['plugins/router', 'knockout', 'data', 'logger', 'global','tinymce'],
    function (router, ko, data, logger, global,tinymce) {
       
        var vm = {
            activate: activate,
            //compositionComplete: compositionComplete,
            upload: upload,
            router: router,
            global: global,
            back: back,
            reset:reset
        };

        tinymce.init({
            selector: "textarea"
        });
           
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
        
        function back() {
            router.navigate('/#uploadQA');
        }

        function reset() {
            document.getElementById('title').setValue('');
        }
        //#endregion
    });