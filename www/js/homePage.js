var selectedTaskId = new Array();
var selectedItemId = new Array();
var selected = false;

function loadTeamTasksList(title) {
	gPageTitleContent = title;
	mainView.router.load({
		url: 'teamTasksScreen.html',
		reload: true,
		ignoreCache: true
	});
}

$$('.gridRow').on('taphold', function () {
	var gridRow = $("ul li div div.gridRow");
	var isAllChecked = 0;

	if ($(this).hasClass('selectedRow')) {
		$('.checkNav').prop('checked', false);
		$(this).removeClass('selectedRow')
	} else {

		$(this).addClass('selectedRow');
	}
	for (i = 0; i < gridRow.length; i++) {
		if ($(gridRow[i]).hasClass('selectedRow')) {
			isAllChecked = 1;
		}
	}
	if (isAllChecked == 0) {
		selected = false;
		$('.reassignTo').attr('disabled', 'disabled');
		$('.reassignTo').addClass('disabledButton');
		$('.checkNavP').addClass('displayNone');
	} else {
		selected = true;
		$('.reassignTo').removeAttr('disabled')
		$('.checkNavP').removeClass('displayNone');
		$('.reassignTo').removeClass('disabledButton');
	}
});


$$('.gridRow').on('click', function () {
	if (selected) {
		var gridRow = $("ul li div div.gridRow");
		var isAllChecked = 0;
		if ($(this).hasClass('selectedRow')) {
			$('.checkNav').prop('checked', false);

			$(this).removeClass('selectedRow')
		} else {

			$(this).addClass('selectedRow');
		}
		for (i = 0; i < gridRow.length; i++) {
			if ($(gridRow[i]).hasClass('selectedRow')) {
				isAllChecked = 1;
			}
		}
		if (isAllChecked == 0) {
			selected = false;
			$('.reassignTo').attr('disabled', 'disabled');
			$('.checkNavP').addClass('displayNone');
			$('.reassignTo').addClass('disabledButton');

		} else {

			$('.reassignTo').removeAttr('disabled')
			$('.checkNavP').removeClass('displayNone');
			$('.reassignTo').removeClass('disabledButton');

		}
	}
});

$$('.checkNavP').on('click', function () {
	var isAllChecked = 1;
	var gridRow = $("ul li div div.gridRow");
	for (i = 0; i < gridRow.length; i++) {
		if ($(gridRow[i]).hasClass('selectedRow') == false) {
			isAllChecked = 0;
		}
	}
	for (i = 0; i < gridRow.length; i++) {
		if (isAllChecked === 1) {
			$('.reassignTo').attr('disabled', 'disabled');
			$('.checkNav').prop('checked', false);
			$(gridRow[i]).find("input").prop('checked', false);
			$(gridRow[i]).removeClass('selectedRow');
			$('.reassignTo').addClass('disabledButton');

		} else {
			$('.reassignTo').removeAttr('disabled')
			$('.checkNav').prop('checked', true);
			$(gridRow[i]).find("input").prop('checked', true);
			$(gridRow[i]).addClass('selectedRow');
			$('.reassignTo').removeClass('disabledButton');
		}
	}
});

function loadGroupMembersPopup(tableId) {
	var popupWidth = window.innerWidth * 0.80;
	var popunHeight = 95;
	popupWidth = Math.floor(popupWidth);
	var selectedRow = $("."+tableId+" ul li div div.selectedRow");
	for (i = 0; i < selectedRow.length; i++) {
		selectedTaskId[i] = ($(selectedRow[i]).find('#ID').html());
		selectedItemId[i] = ($(selectedRow[i]).find('#ItemId').html());
	}
	var data = "{" +
		"\"userData\":" + sessionStorage.getItem("userData") + "," +
		"\"selectedTaskId\":\"" + selectedTaskId + "\"," +
		"\"windowWidth\":\"" + popupWidth + "\"," +
		"\"windowHeight\":\"" + popunHeight + "\"}";
	myApp.showPreloader();
	$.ajax({
		type: "POST",
		url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetGroupMembersPopup",
		contentType: "text/plain",
		dataType: "json",
		data: data,
		success: function (data) {
			myApp.popup('<div class="popup" style="overflow:hidden !important; width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important; padding-left:5px !important; padding-right:5px !important ;padding-top:7px !important; padding-bottom:7px !important" >' + data.content + '</div>', true);
			myApp.hidePreloader();
		},
		error: function (e) {
			myApp.hidePreloader();
			errorMessage(e.message);
		}
	});
}


//ReassignTasks

function ReassignTasks(userShortName, confirmMessage) {
	myApp.confirm(confirmMessage + " " + userShortName, 'MACP',
		function () {
			var data = "{" +
				"\"userData\":" + sessionStorage.getItem("userData") + "," + "\"selectedTaskId\":\"" + selectedTaskId + "\"," +
				"\"userShortName\":\"" + setUser_ShortName(userShortName) + "\"}";
			myApp.showPreloader();
			$.ajax({
				type: "POST",
				url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/ReassignTasks",
				contentType: "text/plain",
				dataType: "json",
				data: data,
				success: function (data) {
					myApp.hidePreloader();
					myApp.alert(data.status, "MACP", function () {
						document.getElementById("tasks").innerHTML = null;
						document.getElementById("toolbar").innerHTML = null;
						reInitHomePage();
						myApp.closeModal('.popup', true);

					});
				},
				error: function (e) {
					myApp.hidePreloader();
					errorMessage(e.message);
				}
			});
		},
		function () {
		}
	);
}
