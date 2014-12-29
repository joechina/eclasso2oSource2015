var createTestPage = function() {
    var page = $('#CreateTestPage');

	var catalog = $('#testCatalog').listview({
		icon: false
	});
	var content = $('#testContent');

	var editExercise = $('#testEditExercise');
	var editSection = $('#testEditSection');
	var editProblem = $('#testEditProblem');
	var editQuiz = $('#testEditQuiz');

	var txtExerciseName = editExercise.find('input[name=name]');
	var txtExerciseClass = editExercise.find('input[name=class]');
	var txtExerciseIsExam = editExercise.find('input[name=isexam]');

	var txtSectionName = editSection.find('input[name=name]');

	var txtProblemName = editProblem.find('input[name=name]');
	var editorProblemContent = null;
	tinyMCE.init({
		selector: '#testProblemContent'
	});

	var editorQuizContent = null;
	tinyMCE.init({
		selector: '#testQuizContent'
	});

	var quizType = editQuiz.find('select[name=type]');
	var quizScore = editQuiz.find('input[name=score]');
	var quizChallengeTrueFalse = $('#testQuizChallengeTrueFalse');
	var quizChallengeSingleChoice = $('#testQuizChallengeSingleChoice');
	var quizChallengeMultipleChoice = $('#testQuizChallengeMultipleChoice');
	var quizChallengeFillBlank = $('#testQuizChallengeFillBlank');

	var exercise = new testDataStore.Exercise('', '', false);

	page.on('pageshow', function() {
		exercise.name = '';
		exercise.clazz = '';
		exercise.isExam = false;
		exercise.sections.length = 0;

		var section = new testDataStore.Section('');
		exercise.addSection(section);
		var problem = new testDataStore.Problem('', '');
		section.addProblem(problem);
		var quiz = new testDataStore.Quiz(QUIZ_TYPE.TRUE_FALSE, '', 0, [], []);
		problem.addQuiz(quiz);

		editorProblemContent = tinyMCE.get('testProblemContent');
		editorQuizContent = tinyMCE.get('testQuizContent');

		refreshCatalog(null);
	});

	var refreshCatalog = function(focus) {
		flushEditorContent();

		var items = exercise.refreshSeq();
		var n = items.length;
		var list = [], idx = 0;
		for (var i = 0; i < n; ++i) {
			var item = items[i];
			if (focus && focus.seq == item.seq) {
				idx = i;
			}
			if (item instanceof testDataStore.Section) {
				list.push('<li><a seq="', i, '"><span>', item.seq, ' <span class="lang">', item.name, '</span>', '</a></li>');
			} else if (item instanceof testDataStore.Problem) {
				list.push('<li><a seq="', i, '"><span>', item.seq, '</span>', item.name ? ' <span class="lang">' + item.name + '</span>' : '', '</a></li>');
			} else {
				list.push('<li><a seq="', i, '"><span>', item.seq, '</span>', '</a></li>');
			}
		};

		var curItem = catalog.html(list.join('')).find('a[seq=' + idx + ']').css('font-style', 'italic');
		localizeAll(catalog);
		displayItem(idx);
		catalog.listview('refresh').find('a').on('click', function() {
			flushEditorContent();
			idx = $(this).attr('seq') * 1;
			curItem.css('font-style', 'normal');
			curItem = catalog.find('a[seq=' + idx + ']').css('font-style', 'italic');
			displayItem($(this).attr('seq') * 1);
		});
	};

	var quizRadioChallengeTrueFalse = quizChallengeTrueFalse.find('input[type=radio]');
	var quizRadioChallengeSingleChoice = quizChallengeSingleChoice.find('input[type=radio]');
	var quizCheckboxChallengeMultipleChoice = quizChallengeMultipleChoice.find('input[type=checkbox]');
	var quizTextChallengeSingleChoice = quizChallengeSingleChoice.find('input[type=text]');
	var quizTextChallengeMultipleChoice = quizChallengeMultipleChoice.find('input[type=text]');
	var quizTextChallengeFillBlank = quizChallengeFillBlank.find('input[type=text]');

	var flushEditorContent = function() {
		var idx = content.data('idx');
		if (idx >= 0) {
			var item = exercise.asList()[idx];
			if (item instanceof testDataStore.Problem) {
				item.content = $.trim(editorProblemContent.getContent());
			} else if (item instanceof testDataStore.Quiz) {
				item.type = quizType.val();
				item.score = quizScore.val();
				item.content = $.trim(editorQuizContent.getContent());

				switch (item.type) {
				case QUIZ_TYPE.TRUE_FALSE:
					item.challenge = [];
					var key = quizRadioChallengeTrueFalse.filter(':checked').val();
					item.key = (key=='0' || key=='1') ? [key * 1] : [];
					break;
				case QUIZ_TYPE.SINGLE_CHOICE:
					item.challenge = [];
					item.key = [];
					quizTextChallengeSingleChoice.each(function() {
						var self = $(this);
						var text = $.trim(self.val());
						if (text != '') {
							item.challenge.push(text);
							if (self.parent().parent().parent().children('input[type=radio]').prop('checked')) {
								item.key.push(item.challenge.length - 1);
							}
						}
					});
					break;
				case QUIZ_TYPE.MULTIPLE_CHOICE:
					item.challenge = [];
					item.key = [];
					quizTextChallengeMultipleChoice.each(function() {
						var self = $(this);
						var text = $.trim(self.val());
						if (text != '') {
							item.challenge.push(text);
							if (self.parent().parent().parent().children('input[type=checkbox]').prop('checked')) {
								item.key.push(item.challenge.length - 1);
							}
						}
					});
					break;
				case QUIZ_TYPE.FILL_BLANK:
					item.challenge = [];
					item.key = [];
					quizTextChallengeFillBlank.each(function() {
						var self = $(this);
						var text = $.trim(self.val());
						if (text != '') {
							item.key.push(text);
						}
					});
					break;
				}
			}
		}
	};

	var displayItem = function(idx) {
		content.data('idx', idx);

		var item = exercise.asList()[idx];
		if (item instanceof testDataStore.Section) {
			txtSectionName.val(item.name);
			editProblem.hide();
			editQuiz.hide();
			editSection.show();
		} else if (item instanceof testDataStore.Problem) {
			txtProblemName.val(item.name);
			editorProblemContent.setContent(item.content);
			editSection.hide();
			editQuiz.hide();
			editProblem.show();
		} else {
			quizType.val(item.type);
			quizScore.val(item.score);
			editorQuizContent.setContent(item.content);

			quizRadioChallengeTrueFalse.prop('checked', false);
			quizRadioChallengeSingleChoice.prop('checked', false);
			quizCheckboxChallengeMultipleChoice.prop('checked', false);
			quizTextChallengeSingleChoice.val('');
			quizTextChallengeMultipleChoice.val('');
			quizTextChallengeFillBlank.val('');
			switch (item.type) {
			case QUIZ_TYPE.TRUE_FALSE:
				if (item.key.length > 0) {
					var key = item.key[0];
					if (key==0 || key==1) {
						quizRadioChallengeTrueFalse.eq(item.key[0]).prop('checked', true);
					}
				}
				break;
			case QUIZ_TYPE.SINGLE_CHOICE:
				for (var i = 0; i < item.challenge.length; ++i) {
					quizTextChallengeSingleChoice.eq(i).val(item.challenge[i]);
				}
				if (item.key.length > 0) {
					quizRadioChallengeSingleChoice.eq(item.key[0]).prop('checked', true);
				}
				break;
			case QUIZ_TYPE.MULTIPLE_CHOICE:
				for (var i = 0; i < item.challenge.length; ++i) {
					quizTextChallengeMultipleChoice.eq(i).val(item.challenge[i]);
				}
				for (var i = 0; i < item.key.length; ++i) {
					quizCheckboxChallengeMultipleChoice.eq(item.key[i]).prop('checked', true);
				}
				break;
			case QUIZ_TYPE.FILL_BLANK:
				for (var i = 0; i < item.key.length; ++i) {
					quizTextChallengeFillBlank.eq(i).val(item.key[i]);
				}
				break;
			}

			quizType.trigger('change');
			// render challenge and key
			editSection.hide();
			editProblem.hide();
			editQuiz.trigger('create');
			editQuiz.show();
		}
	};

	$('#testBtnSave').on('click', function() {
		exercise.name = txtExerciseName.val();
		exercise.clazz = txtExerciseClass.val();
		exercise.isExam = txtExerciseIsExam.prop('checked');

		flushEditorContent();

		exercise.submit(function(){
	        alert('saved');
	    }, function(err) {
			console.log(err);
	        alert(err.message);
	    });
	});

	$('#testBtnLoad').on('click', function () {
		testDataStore.getExercise($('#testname').val(), function(result) {
			exercise = result;
			displayItem(0);
			refreshCatalog(null);
		}, function(err) {
			console.log(err);
	        alert(err.message);
		});
	});

	txtSectionName.on('input', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];

		item.name = txtSectionName.val();
		catalog.find('a[seq=' + idx + ']').html('<span>' + item.seq + ' <span class="lang">' + item.name + '</span>');
	});

	txtProblemName.on('input', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];

		item.name = txtProblemName.val();
		catalog.find('a[seq=' + idx + ']').html('<span>' + item.seq + '</span>' + (item.name ? ' <span class="lang">' + item.name + '</span>' : ''));
	});

	$('#testBtnAddSection').on('click', function() {
		var section = new testDataStore.Section('');
		exercise.addSection(section);

		refreshCatalog(section);
	});

	$('#testBtnMoveUpSection').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveUp()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnMoveDownSection').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveDown()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnDeleteSection').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.remove()) {
			refreshCatalog(idx == 0 ? null : exercise.asList()[idx - 1]);
		}
	});

	$('#testBtnAddProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		var problem = new testDataStore.Problem('', '');
		item.addProblem(problem);
		refreshCatalog(item);
	});

	$('#testBtnMoveUpProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveUp()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnMoveDownProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveDown()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnDeleteProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.remove()) {
			refreshCatalog(idx == 0 ? null : exercise.asList()[idx - 1]);
		}
	});

	$('#testBtnAddQuiz').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		var quiz = new testDataStore.Quiz(QUIZ_TYPE.TRUE_FALSE, '', 0, [], []);
		item.addQuiz(quiz);
		refreshCatalog(item);
	});

	$('#testBtnMoveUpQuiz').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveUp()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnMoveDownQuiz').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveDown()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnDeleteQuiz').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.remove()) {
			refreshCatalog(idx == 0 ? null : exercise.asList()[idx - 1]);
		}
	});

	quizType.on('change', function() {
		switch (quizType.val()) {
		case QUIZ_TYPE.TRUE_FALSE:
			quizChallengeSingleChoice.hide();
			quizChallengeMultipleChoice.hide();
			quizChallengeFillBlank.hide();
			quizChallengeTrueFalse.show();
			break;
		case QUIZ_TYPE.SINGLE_CHOICE:
			quizChallengeTrueFalse.hide();
			quizChallengeMultipleChoice.hide();
			quizChallengeFillBlank.hide();
			quizChallengeSingleChoice.show();
			break;
		case QUIZ_TYPE.MULTIPLE_CHOICE:
			quizChallengeTrueFalse.hide();
			quizChallengeSingleChoice.hide();
			quizChallengeFillBlank.hide();
			quizChallengeMultipleChoice.show();
			break;
		case QUIZ_TYPE.FILL_BLANK:
			quizChallengeTrueFalse.hide();
			quizChallengeSingleChoice.hide();
			quizChallengeMultipleChoice.hide();
			quizChallengeFillBlank.show();
			break;
		}
	});

};
