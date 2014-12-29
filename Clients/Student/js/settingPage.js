var settingPage = function() {
	var page = $('#settingPage');
	//var header = page.children('div[data-role=header]');
	//var content = page.children('div[data-role=content]');
	//var footer = page.children('div[data-role=footer]');


	var form = $('#setAccount').find('form');
	var txtUser = form.find('input[name=username]');
	var txtName = form.find('input[name=name]');
	var txtEmail = form.find('input[name=email]');
	var txtPhone = form.find('input[name=phone]');
	settingPage.setUser = function(user) {
		txtUser.val(user.UserId);
		txtName.val(user.Name);
		txtEmail.val(user.Email || '');
		txtPhone.val(user.Phone || '');
	};

	var resetActInfo = function() {
		isChangingAcct = false;
		txtName.prop('disabled', true).parent().addClass('ui-state-disabled');
		txtEmail.prop('disabled', true).parent().addClass('ui-state-disabled');
		txtPhone.prop('disabled', true).parent().addClass('ui-state-disabled');

		localize(btnChgAct, 'Change Details');
		localize(btnChgPwd, 'Change Password');
	};

	var isChangingAcct = false;
	var btnChgAct = $('#setBtnChgAct').on('click', function() {
		if (isChangingAcct) {
			settingPage.setUser(dataContext.user);
			resetActInfo();
		} else {
			txtName.prop('disabled', false).parent().removeClass('ui-state-disabled');
			txtEmail.prop('disabled', false).parent().removeClass('ui-state-disabled');
			txtPhone.prop('disabled', false).parent().removeClass('ui-state-disabled');
			localize(btnChgAct, 'Cancel');
			localize(btnChgPwd, 'Save');
			isChangingAcct = true;
		}
	});

	var chgPwd = $('#setChgPwd').popup().trigger('create');

	var btnChgPwd = $('#setBtnChgPwd').on('click', function() {
		if (isChangingAcct) {
			// submit account info
			resetActInfo();
		} else {
			chgPwd.popup('open');
		}
	});

	$('#setBtnPwdCancel').click(function() {
		chgPwd.popup('close');
	});

	$('#setBtnPwdSave').click(function() {
		// save new password
		chgPwd.popup('close');
	});

	$('#setBtnLogout').on('click', function() {
		if (!confirm('Are you sure you want to logout?')) {
			return;
		}

		dataContext.signout(function() {
			history.back();
		});
	});

	var setLang = $('#setLang input').on('click', function() {
		setLocaleLanguage($(this).val());
	});

	page.on('pageshow', function() {
		setLang.val([getLocaleLanguage()])
			.checkboxradio('refresh');
	});
};
