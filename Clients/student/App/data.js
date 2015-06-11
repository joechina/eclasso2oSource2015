define([
    'breeze',
    'jquery',
    'q'],
    function (breeze, $, Q) {

        var host = 'http://localhost:56360/';
        //var host = 'http://eclasso2oasia.azurewebsites.net/';
        //var host = 'http://eclasso2o.chinacloudsites.cn/';

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
            changepassword: changepassword,
            signin: signin,
            canDeactivate: canDeactivate,
            save: save,
            getCurrentUser: getCurrentUser,
            getquestions: getquestions,
            getallannouncements: getallannouncements,
            getsentannouncements:getsentannouncements,
            getuserannouncements: getuserannouncements,
            getuserexersize: getuserexersize,
            getuserexersizes: getuserexersizes,
            getuserexersizes_status: getuserexersizes_status,
            getallexersizes: getallexersizes,
            getexersize:getexersize,
            getproblem:getproblem,
            getsections: getsections,
            getClasses: getClasses,
            getClass: getClass,
            getClassUserIds: getClassUserIds,
            getUserClasses: getUserClasses,
            getMedia: getMedia,
            getUsers: getUsers,
            getTeachers: getTeachers,
            getStudents: getStudents,
            getuser:getuser,
            getUserQuizs: getUserQuizs,
            create: create,
            user: user,
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

        function getMedia(id) {
            var query = breeze.EntityQuery.from("Media")
                            .where("Id", "==", id);
            return manager.executeQuery(query);
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

        function getsentannouncements() {
            var query = breeze.EntityQuery.from('Announcements').where("Draft","==","0");
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

        function getquizs(id) {
            var query = breeze.EntityQuery.from('Quizs')
                            .where("Id", "==", id);
            return manager.executeQuery(query);
        }

        function getUserQuizs(uid, qid) {
            var Predicate = breeze.Predicate;
            var p1 = new Predicate("UserId", "==", uid);
            var p2 = new Predicate("QuizId", "==", qid);

            var query = breeze.EntityQuery.from('UserQuizs').where(p1.and(p2));

            return manager.executeQuery(query);
        }

        function getallexersizes () {
            var query = breeze.EntityQuery.from('Exersizes');
            return manager.executeQuery(query);
        }

        function getuserexersizes(uid) {
            var query = breeze.EntityQuery.from('UserExersizes').where("UserId", "==", uid).orderBy('ExersizeId');
            return manager.executeQuery(query);
        }

        function getuserexersizes_status(uid, v) {
            var Predicate = breeze.Predicate;
            var p1 = new Predicate("UserId", "==", uid);
            var p2 = new Predicate("Completed", "==", v);

            var query = breeze.EntityQuery.from('UserExersizes').where(p1.and(p2));
            return manager.executeQuery(query);
        }

        function getuserexersize(uid, eid) {
            var Predicate = breeze.Predicate;
            var p1 = new Predicate("UserId", "==", uid);
            var p2 = new Predicate("ExersizeId", "==", eid);

            var query = breeze.EntityQuery.from('UserExersizes').where(p1.and(p2));
            return manager.executeQuery(query);
        }

        function getexersize(eid) {
            var query = breeze.EntityQuery.from('Exersizes').where("Id", "==", eid);
            return manager.executeQuery(query);
        }

        function getClasses() {
            var query = breeze.EntityQuery.from('Classes');
            return manager.executeQuery(query);
        }

        function getClass(cid) {
            var query = breeze.EntityQuery.from('Classes').where("Id", "==", cid);
            return manager.executeQuery(query);
        }

        function getClassUserIds(cid) {
            var query = breeze.EntityQuery.from('UserClasses').where("ClassId", "==", cid).select('UserId');
            return manager.executeQuery(query);
        }

        function getUserClasses(uid) {
            var query = breeze.EntityQuery.from('UserClasses').where("UserId", "==", uid);
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

        function getuser(id) {
            var query = breeze.EntityQuery.from('Users').where("Id", "==", id);
            return manager.executeQuery(query);
        }
        
        function save(entity) {
            if (entity.quizCount) {
                if (entity.quizCount() !== entity.TotalQuizzes()) {
                    entity.TotalQuizzes(entity.quizCount());
                }
            }
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
                    if (err.responseJSON != undefined) { // in case of network connection failure, responseJSON will return null
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

        function changepassword(oldpassword, newpassword) {
            return $.ajax({
                url: host + 'api/account/changepassword',
                type: 'POST',
                dataType: 'json',
                data: {
                    'username': 'dummy',
                    'name': 'dummy',
                    'password': newpassword,
                    'confirmPassword': newpassword,
                    'role': 'dummy',
                    'oldpassword': oldpassword
                },
                beforeSend: function (xhr) {
                    if (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + getAccessToken());
                    }
                },
                error: function (err) {
                    errs.push(err.responseText);
                    console.log(err.responseText);
                }
            });
        }

        function setAccessToken(accessToken) {
            if (accessToken === "") {
                localStorage.setItem("lastsignin",undefined);
            }
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
            store.registerEntityTypeCtor("Exersize", null, ExersizeInit);
            store.registerEntityTypeCtor("Quiz", null, QuizInit);
            store.registerEntityTypeCtor("Problem", null, ProblemInit);
        }

        function ExersizeInit(self) {
            self.quizCount = ko.computed(function () {
                var result = 0;
                for (var i = 0; i < self.Sections().length; i++) {
                    var sectionproblems = self.Sections()[i].Problems();
                    for (var j = 0; j < sectionproblems.length; j++) {
                        var problem = sectionproblems[j];
                        result = result + problem.Quizzes().length;
                    }
                }
                return result;
            })
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

        function ProblemInit(self) {
            //self.Media = ko.observable();
            self.loadMedia = function () {
                var query = breeze.EntityQuery.from('Media').where("Id", "==", self.Media);
                return manager.executeQuery(query);
            }
        }
    });