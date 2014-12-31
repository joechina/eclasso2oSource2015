define([
    'breeze',
    'jquery',
    'q',
    'services/global'],
    function (breeze, $, Q, global) {
        var manager = new breeze.EntityManager(global.datahost + 'breeze/eClassO2OApi');
        var host = global.datahost;
        var islocal = false;
        var isconnected = true;
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
            save: save
        }

        return data;

        function canDeactivate() {
            if (manager.hasChanges()) {
                var msg = 'Do you want to leave and discharge changes?';
                return app.showMessage(msg, global.current(), ['Yes', 'No'])
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

        function save(entity) {
            manager.attachEntity(entity, entity.entityAspect.entityState);
            return manager.saveChanges();
        };

        function signin(username, password) {
            //var rst;
            if (!getAccessToken()) {
                return $.post(host + 'token',
                    {
                        grant_type: 'password',
                        username: username,
                        password: password
                    }).then(function (result) {
                        setAccessToken(result.access_token);
                        configureBreeze();
                    });

            }
            else {
                configureBreeze();
                return Q(undefined);
            }
        }

        function register(username, password, password2, callback) {
            return $.ajax({
                url: host + 'api/account/register',
                type: 'POST',
                dataType: 'json',
                data: {
                    'userName': username,
                    'password': password,
                    'confirmPassword': password2
                },
                success: function () {
                    callback();
                },
                error: function (err) {
                    console.log(err);
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

        function getPlanList() {
            var query = breeze.EntityQuery
                    .from("Plans").expand("Days")
                    .orderBy("Id desc");
            return manager.executeQuery(query).then(function (data) {
                plans([]);
                plans(data.results);
            });
        }

        function getPlan(id) {
            if (id === 0) {
                return manager.createEntity('Plan');
            }
            else {
                var query = breeze.EntityQuery
                    .from("Plans").expand("Days").expand("Days.Destinations")
                    .where("Id", "eq", id)
                    .orderBy("Id desc");
                return manager.executeQuery(query);
            }
        }

        function getDay(id) {

        }

        function getDestination(id) {

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
            store.registerEntityTypeCtor("Plan", Plan, null);
            store.registerEntityTypeCtor("Day", Day, null);
            store.registerEntityTypeCtor("Destination", Destination, null);

        }

        function Plan() {
            var self = this;
            self.LeaveDate = new Date(1, 1, 1);
            self.ReturnDate = new Date(1, 1, 1);
            self.Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAABKCAIAAAAJ0UD+AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAyFJREFUeF7tmVFy6yAMRbuuLCjryWqymSymDywJBMg2TpPMu849XzEWAt3Tdtrpzy9BgJ4woCcM6AkDesKAnjCgJwzoCQN6woCeMKAnDOgJA3rCgJ4woCcM6AkDesKAnjCgJwzoCQN6wuCznu7Xn+tdPw+kl4n198LjdtmteQo5/nJ76PP/xSc9SRKrUcx4ypaEpot2niW8AT0JGvF6EDOeMtVVqaWnV6FJbsUw6ylTxazUi8wjqe95ql8eEXPXfp7PeNJY6zA15xnC8HJuq+nMapq4hzU5vScb0I/yAk9b6JH74R32NF5FWqB7MkkTUb9u4GlNnvH41syJPZmkMkWaaV3YxMC5YdegnHGMmby/xZNMUEfTSMdRhd2BqxLX4o2eZMUqz+spz1Dn0kCv9+eS1SBCVw5735bHtQ3levqc+B5PFReYRXkMF4Qkk+nTsTdu3U7bC5KeEs7Sa8gNu2hMyHhKYG+EnmqC88McHd5U2J42Yvd+tWW/I9Eund1TiehNnlz/3kuQ+kLUNzixXTq1p/KttKDDuMTm8QEtXXMz174NUI4YQvUnt8lqp2bxWzxZipfbvUnhz568hfx56VvkZXyFkQvyStnh0Ku2G6SJlZ7Wk86eJ3Af59gcPuwmOyxHeUoPS+2y2BZ0lHp9znTHyOO4ffOqL+OtP/cet6uMFSabF9fG2xo+bNYFXR79um4co9by4H5uUR5P6akQRavZBKkltob30SuDgVrTxKtn9n3jZXoyNJ9x9q3h5VWzZ8zZFbX5BruD7QudmC/2lNCM+vHXhx9bRS1kTZbagHV/rR4WDN8joXUrnN3T8m4to6B+TPXxWH6bbGubjLvA82OptvSDo+hpF4koqB81hXTnLe2iPZZ98E6vUO8gtWOlFH6HJ8urJShfFZiwZAt7Nm1HqRs6+Bb0lNhMqJL+HMqFsYBO9lxy/j8vw5fLu8M/wGc8kb9CTxjQEwb0hAE9YUBPGNATBvSEAT1hQE8Y0BMG9IQBPWFATxjQEwb0hAE9YUBPGNATBvSEAT1hQE8Y0BMG9IQBPWFATxjQEwb0hMDv7z+6uuMJXVT5cwAAAABJRU5ErkJggg==";
            self.Name = "New Plan";
            self.Description = "to be replaced";
            self.id = 0;
        }

        function Day() {
            var self = this;
            self.seq = 0;
            self.comment = "to be replace";
        }

        function Destination() {
            var self = this;
            self.name = "New Destination";
            self.latitude = 0;
            self.longitude = 0;
            self.comment = "to be replace";
            self.isnotify = false;
            self.arrive = new Date(1, 1, 1);
            self.leave = new Date(1, 1, 1);

        }
    });