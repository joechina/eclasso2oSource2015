var createMessagePage = function () {
    var page = $('#CreateMessagePage');

    var form = page.find('form');
	var selPriority = form.find('select[name=priority]');

    var selTargetType = form.find('select[name=target_type]');
    var txtTarget = form.find('input[name=target]');

	var publishRow = $('#messagePublishRow');

	var editorAnnoucement = null;
	tinyMCE.init({
		selector: '#messageAnnouncement'
	});

	page.on('pageshow', function() {
		publishRow.hide();

		console.log('pr', publishRow);

		editorAnnoucement = tinyMCE.get('messageAnnouncement');
	});

    var announcementId = null;

	$('#messageBtnSave').on('click', function () {
		var announcement = $.trim(editorAnnoucement.getContent());
		var priority = parseInt(selPriority.val());

        //Validation Skipped

        //Save Question Example
        var newquestion = dataContext.create('Announcement');
        newquestion.Content = announcement;
        newquestion.Priority = priority;
        newquestion.Create = Date.now();

	    dataContext.save(newquestion).then(function () {
	        announcementId = newquestion.Id;
            publishRow.show();
        }).fail(function (error) {
            alert('Save failed!');
        });
    });

	$('#messageBtnPublish').on('click', function () {
	    var target = $.trim(selTargetType.val() + txtTarget.val());
	    alert(target);
	    dataContext.publishAnnouncement(announcementId, target,
	    	function (result, error) {
				publishRow.hide();
				announcementId = null;
	            if (result) {
	                alert(result.count);
	            }
	        }
	    );
	});

};

