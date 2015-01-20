define([
    'breeze',
    'jquery',
    'q'],
    function (breeze, $, Q) {
        var host = 'http://localhost:56360/';
        //var host = 'http://eclasso2o.azurewebsites.net/';
        var manager = new breeze.EntityManager(host + 'breeze/eClassO2OApi');
        var islocal = false;
        var isconnected = true;
        var user = ko.observable();
        var data = {
            metadataStore: manager.metadataStore,
            initalize: initalize,
            switchconnection: switchconnection,
            setAccessToken: setAccessToken,
            getAccessToken: getAccessToken,
            configureBreeze: configureBreeze,
            register: register,
            signin: signin,
            canDeactivate: canDeactivate,
            save: save,
            getUser: getCurrentUser,
            getquestions: getquestions,
        }

        return data;

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
                user(result);
            }).fail(function (err) {
                alert(err.message);
            });
        }

        function getquestions() {
            var query = breeze.EntityQuery.from('Questions');
            return manager.executeQuery(query);
        }

        function getannouncements() {
            var query = breeze.EntityQuery.from('Announcements');
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
                    errs.push(err.responseJSON.error_description);
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

        function register(username, password, password2, errs) {
            return $.ajax({
                url: host + 'api/account/register',
                type: 'POST',
                dataType: 'json',
                data: {
                    'username': username,
                    'name': username,
                    'password': password,
                    'confirmPassword': password2,
                    'role':'S'
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
            
        }

    });