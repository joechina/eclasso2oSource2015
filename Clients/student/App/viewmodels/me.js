define(['plugins/router', 'knockout', 'data', 'logger'], function(router, ko, data, logger) {
	var Class = ko.observable();
	var Classes = ko.observableArray();
	var myClasses = ko.observableArray();
	var user = ko.observable();
	var totalex = ko.observable();
	var appver = 1;
	var cacheSize = ko.observable(0);

	var me = {
		Classes : Classes,
		user : user,
		myprofile : myprofile,
		totalex : totalex,
		activate : activate,
		myclazz : myclazz,
		myreport : myreport,
		clearcache : clearcache,
		cacheSize : cacheSize,
		aboutparrot : aboutparrot,
		feedback : feedback,
		router : router,
		logout : logout,
		appver : appver,
	};

	shouter.subscribe(function(newValue) {
		activate();
		logger.log('reload me');
	}, this, "refresh_viewmodels/me");

	return me;

	//#region Internal Methods
	function activate() {
		//get current sign in user
		user(data.user());

		data.getUserClasses(user().Id()).then(function(data) {
			Classes(data.results);
		});

		// get submit exercises number
		data.getuserexersizes_status(user().Id(), true).then(function(data) {
			totalex(data.results.length);
		});


		//getCacheSize();

		$("#goback").css({
			display : "none"
		});
		$("#refresh").css({
			display : "inline"
		});
		//$("#main_title").css({ float: "center", position: "absolute" });

		//appver = api.appVersion;

		logger.log('me page activated');
	}

	/*function getCacheSize() {
	    api.getCacheSize(function (ret, err) {
	        if (ret) {
	            cacheSize(Math.parseInt(ret.size / 1024 / 1024) / 100 + "MB");

	        } else {
	            alert(JSON.stringify(err));
	        }
	    });
	}*/

	function myprofile() {
		router.navigate('/#myprofile');
	}

	function myclazz() {
		router.navigate('/#myclazz');
	}

	function logout() {
		data.setAccessToken('');
		router.navigate('/#signin');
	}

	function feedback() {
		router.navigate('/#feedback');
	}

	function myreport() {
		router.navigate('/#myreport');
	}

	function clearcache() {
		//api.clearCache();
		alert('缓存清除完毕');
	}

	function aboutparrot() {
		//router.navigate('/#tou');
	}

	//#endregion
});
