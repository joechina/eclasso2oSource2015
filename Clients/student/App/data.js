define([
    'breeze',
    'jquery',
    'q'],
    function (breeze, $, Q) {

        //var host = 'http://localhost:56360/';
        var host = 'http://eclasso2oasia.azurewebsites.net/';

        var manager = new breeze.EntityManager(host + 'breeze/eClassO2OApi');
        var islocal = false;
        var isconnected = true;
        var user = ko.observable();
        var store;
        var data = {
            metadataStore: store,
            initalize: initalize,
            switchconnection: switchconnection,
            setAccessToken: setAccessToken,
            getAccessToken: getAccessToken,
            configureBreeze: configureBreeze,
            register: register,
            signin: signin,
            canDeactivate: canDeactivate,
            save: save,
            getCurrentUser: getCurrentUser,
            getquestions: getquestions,
            getallannouncements: getallannouncements,
            getuserannouncements: getuserannouncements,            
            getexersizes: getexersizes,
            getproblem:getproblem,
            getsections: getsections,
            getmedia:getmedia,
            getClasses: getClasses,
            getUsers: getUsers,
            getTeachers: getTeachers,
            getStudents:getStudents,
            getsettings: getsettings,
            create: create,
            user:user,
        }

        return data;

        function create(entityname) {
            return manager.createEntity(entityname);
        }

        function canDeactivate() {
            if (manager.hasChanges()) {
                var msg = 'Do you want to leave and discharge changes?';
                return app.showMessage(msg, 'Warning', ['Yes', 'No'])
                    .then(function (selectedOption) {
                        if (selectedOption === 'Yes') {
                            manager.rejectChanges();
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
            }
            else {
                return Q(true);
            }
        }

        function getCurrentUser() {
            var query = breeze.EntityQuery.from('currentUser');
            return manager.executeQuery(query).then(function (result) {
                user(result.results[0]);
            }).fail(function (err) {
                alert(err.message);
            });
        }

        function getquestions() {
            var query = breeze.EntityQuery.from('Questions').orderBy("QuestionDetail");
            return manager.executeQuery(query);
        }

        function searchQuestion (q) {
            var query = breeze.EntityQuery.from("Questions")
                            .where("QuestionDetail", "contains", q)	// how to search contains all from keywords array?
                            .orderBy("Create DESC");
            return manager.executeQuery(query);
        };

        function getallannouncements() {
            var query = breeze.EntityQuery.from('Announcements');
            return manager.executeQuery(query);
        }

        function getuserannouncements(id) {
            
            var query = breeze.EntityQuery.from('UserAnnouncements');
            return manager.executeQuery(query);
        }

        function getsections() {
            var query = breeze.EntityQuery.from('ExersizeSections');
            return manager.executeQuery(query);
        }

        function getproblem(id) {
            var query = breeze.EntityQuery.from('Problems')
                            .where("Id", "==", id);
            return manager.executeQuery(query);
        }

        function getmedia(id) {
            var query = breeze.EntityQuery.from('Media')
                            .where("Id", "==", id);
            return manager.executeQuery(query);
        }

        function getquizs(id) {
            var query = breeze.EntityQuery.from('Quizs')
                            .where("Id", "==", id);
            return manager.executeQuery(query);
        }
        function getexersizes () {
            var query = breeze.EntityQuery.from('Exersizes');
            return manager.executeQuery(query);
        }

        function getClasses() {
            var uid = user().Id();
            var query = breeze.EntityQuery.from('Classes');
            return manager.executeQuery(query);
        }

        function getUsers() {
            var query = breeze.EntityQuery.from('Users');
            return manager.executeQuery(query);
        }

        function getTeachers() {
            var query = breeze.EntityQuery.from('Users').where("Role", "==", "T");
            return manager.executeQuery(query);
        }

        function getStudents() {
            var query = breeze.EntityQuery.from('Users').where("Role", "==", "S");
            return manager.executeQuery(query);
        }

        function getsettings() {
            var query=breeze.EntityQuery.from('Users');
            return manager.executeQuery(query);
        }

        function save(entity) {
            manager.attachEntity(entity, entity.entityAspect.entityState);
            return manager.saveChanges();
        };

        function signin(username, password, errs) {
            if (!getAccessToken()) {
                return $.post(host + '/token', {
                    grant_type: 'password',
                    UserName: username,
                    password: password
                }).fail(function (err) {
                    console.log('signin err', err);
                    if (err.responseJSON != undefined) {
                        errs.push(err.responseJSON.error_description);
                    }
                }).done(function (result) {
                    if (result.access_token) {
                        setAccessToken(result.access_token);
                        //getCurrentUser();
                    }
                });
            }
            else {
                configureBreeze();
                return Q(undefined);
            }
        }

        function register(userid, username, password, password2, errs, role) {
            return $.ajax({
                url: host + 'api/account/register',
                type: 'POST',
                dataType: 'json',
                data: {
                    'username': userid,
                    'name': username,
                    'password': password,
                    'confirmPassword': password2,
                    'role':role
                },
                error: function (err) {
                    errs.push(err.responseText);
                    console.log(err.responseText);
                }
            });
        }

        function setAccessToken(accessToken) {
            sessionStorage.setItem("accessToken", accessToken);
        };

        function getAccessToken() {
            return sessionStorage.getItem("accessToken");
        };

        function switchconnection(local, connect) {
            islocal = local;
            isconnected = connect;
            if (islocal === true) {
                //export to local storage
            }
        }

        function create(entity) {
            return manager.createEntity(entity);
        }

        function initalize() {
            //store = manager.metadataStore;
        }

        function configureBreeze() {
            // configure to use camelCase
            breeze.NamingConvention.camelCase.setAsDefault();

            // configure to resist CSRF attack
            // get the current default Breeze AJAX adapter & add header
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                beforeSend: function (xhr, settings) {
                    if (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + getAccessToken());
                    }
                }
            }

            var store = manager.metadataStore;
            store.registerEntityTypeCtor("Quiz", null, QuizInit);
        }

        function QuizInit(self) {
            self.options = ko.observableArray();
            self.type = ko.computed(function () {
                switch(self.QuizType())
                {
                    case 0:
                        return 'fillblank';
                    case 1:
                        return 'multipleselection';
                }
            });
        }
    });