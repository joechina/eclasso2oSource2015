define(['plugins/router', 'knockout', 'data', 'logger'],
    function (router, ko, data, logger) {
        var Class = ko.observable();
        var Classes = ko.observableArray();
        var myClasses = ko.observableArray();
        var user = ko.observable();
       
        var me = {
            Class: Class,
            Classes:Classes,
            myClasses:myClasses,
            user:user,
            activate: activate,
            openClass: openClass,
            router: router,
            backtolist: backtolist,
            joinClass: joinClass,
            editprofile: editprofile,
            myClasses: myClasses
        };

        return me;

        //#region Internal Methods
        function activate(id) {
           
            data.getClasses().then(function (data) {
                Classes(data.results);
            });

            for (i=0; i< Classes().length;i++) {
                var c = Classes()[0];
                var uid = data.user().Id();
                for (j = 0; j < c().Users().length; j++) {
                    var cuid = c().Users()[0].UserId;
                    if (cuid == uid) {
                        myClasses.push(c);
                    }
                }
            }
            
            user(data.user());

            $("#goback").css({ display: "none" });

            logger.log('Classes activated');
        }

        function openClass(selected) {
            Class(selected);
        }

        function joinClass() {

        }

        function backtolist() {
            Class(undefined);
        }

        function editprofile() {

        }

        function logout() {

        }
        //#endregion
    });