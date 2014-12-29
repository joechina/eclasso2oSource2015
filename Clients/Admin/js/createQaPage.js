var createQaPage = function() {
    var page = $('#CreateQaPage');

    var form = page.find('form');
    var txtQuestion = form.find('input[name=question]');
    var txtSearch = $('#qaTxtSearch');

	var listResult = $('#qaListResult');

	tinyMCE.init({
		selector: '#qaAnswer'
	});

    $('#qaBtnSave').on('click', function () {
        var question = $.trim(txtQuestion.val());
        var answer = $.trim(tinyMCE.get('qaAnswer').getContent());

        //Validation Skipped

        //Save Question Example
        var newquestion = dataContext.create('Question');
        newquestion.IsPublic = true;
        newquestion.QuestionDetail = question;
        newquestion.Answer = answer;
        newquestion.Create = Date();
        newquestion.UserId = dataContext.user.Id;

        dataContext.save(newquestion).then(function () {
            alert('Question saved!');
        }).fail(function () {
            alert('Save failed!');
        });

    });

    $('#qaBtnSearch').on('click', function () {
        var search = txtSearch.val();

        //Validation Skipped

        //Save Question Example
        listResult.empty();
        dataContext.searchQuestion(search, function(result) {
			var list = [];
			if ($.isArray(result)) {
				for (var i = 0; i < result.length; ++i) {
					var qa = result[i];
					list.push('<li><span>', qa.QuestionDetail, ' - [answer]: ', qa.Answer, '</span></li>');
				}
			}
			listResult.html(list.join(''));
        });
    });
};

