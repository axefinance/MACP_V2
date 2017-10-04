var StartWfEligibilityObject;
var WorkflowId;
var WorkFlowName;
var DeviatedMsg;
var RequiredDocument;
var RequiredMitigant;

function startWorkflow_ButtonAction(mainItemId) {
    myApp.showPreloader();
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/StartWorkFlowButtonAction';
    var popupWidth = window.innerWidth * 0.80;
    var popunHeight = 95;
    popupWidth = Math.floor(popupWidth);
    var data = "{" +
       "\"userData\":" + sessionStorage.getItem("userData") + "," +
       "\"entityName\":\"" + gSubItem + "\"," +
       "\"itemId\":\"" + mainItemId + "\"," +
       "\"popupWidth\":\"" + popupWidth + "\"," +
       "\"popupHeight\":\"" + popunHeight + "\"}";
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {

            //myApp.closeModal();
            myApp.closeModal(".popup", true);
            manageStartWorkFlowResponse(data,mainItemId);


        },
        error: function (e) {
            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });
}

function manageStartWorkFlowResponse(data,mainItemId) {
    switch (data.status) {
        case "ok":
            {
                if (data.response === "defaultwf") {
                    myApp.hidePreloader();
                    myApp.confirm(data.message, 'MACP',
                     function () {
                         startWorkFlowItem(data.wfId,mainItemId);
                     },
                                 function () {

                                 }
                                 );
                }
                else if (data.response === "wfStillRunning") {
                    myApp.hidePreloader();
                    myApp.alert(data.message, 'MACP');
                }
                else {
                    myApp.hidePreloader();
                    createPopup(data.Content,"","10%","10%","80%","80%");
                    if (data.runningWF != undefined)
                        myApp.alert(data.runningWF, 'MACP', function () {
                            myApp.closeModal(".popup", true);
                        });
                    if (data.noPublishedWF != undefined) {
                        myApp.alert(data.noPublishedWF, 'MACP', function () {
                            myApp.closeModal(".popup", true);
                        });
                    }
                }
                break;
            }
        case "error":
            {
                myApp.alert("error in workflow", "Error");
            }
    }
}

function startWorkFlowEvent(workflowId, message, workflowName,mainItemId) {
    WorkFlowName = workflowName;
    WorkflowId = workflowId;
    myApp.confirm(message, 'MACP',
                           function () {
                               startWorkFlowItem(workflowId,mainItemId);
                           },
                                       function () {

                                       }
                                       );
}

function startWorkFlowItem(workflowId,mainItemId) {

    myApp.showPreloader();
    var popupWidth = window.innerWidth * 0.80;
    popupWidth = Math.floor(popupWidth);
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/StartWorkFlow';
    var data = "{" +
       "\"itemId\":\"" + mainItemId + "\"," +
       "\"userData\":" + sessionStorage.getItem("userData") + "," +
       "\"workfloawId\":\"" + workflowId + "\"," +
       "\"workflowName\":\"" + WorkFlowName + "\"," +
       "\"popupWidth\":\"" + popupWidth + "\"," +
       "\"subItem\":\"" + gSubItem + "\"}";
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {
            myApp.hidePreloader();
            myApp.closeModal(".popup", true);
            manageStartWorkFlowItemResponse(data,mainItemId);

        },
        error: function (e) {

            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });
}

function manageStartWorkFlowItemResponse(data,mainItemId) {
    myApp.hidePreloader();
    if (data.withEligibility != undefined) {
        StartWfEligibilityObject = data.EligibilityObject;
        myApp.hidePreloader();
        createPopup(data.poponContent,"","10%","10%","80%","80%");
    }
    else if (data.behavior != undefined) {
        manageControlValidatorBehavior(data,mainItemId);
    }
    else if (data.requiredDocument != undefined) {
        manageRequiredDocumentResponse(data,mainItemId);
    }
    else if (data.requiredMitigant != undefined) {
        managerRequiredMitigantResponse(data,mainItemId);
    }
    else {
        gHomeBackButton.style.visibility = "hidden";
        myApp.hidePreloader();
        myApp.closeModal('.popup');
        mainView.router.back({ force: true, pageName: "homePage" });
        mainView.history = ["#homePage"];
        if (!checkInternetConnection())
            myApp.alert("please check your internet connection");
        else
            leftView.router.load({ force: true, pageName: 'MenuParent', animatePages: false });
    }
}

function managerRequiredMitigantResponse(data,mainItemId) {
    RequiredMitigant = data.requiredMitigant;
    DeviatedMsg = data.message;
    if (data.withDeviation === "true") { 
        /*
        var popupContent=data.message + "</br></br>" + data.requiredMitigant + "</br></br>" + data.question + "</br></div><div class='list-block' ><ul><li class='align-top'><div class='item-content'><div class='item-media'></div><div class='item-inner'><div class='item-input'><textarea id='deviationComment' onkeyup='saveStartWorkflow_RequiredMitigantComent_enabledButton(this)'></textarea></div></div></div></li></ul></<div><br><br><br><br><div class='row'><div class='col-50'><a href='#' class='button button-fill disabled' style='width:50%; margin-left:50%' onclick='saveStartWorkflow_RequiredMitigantComent(\""+mainItemId+"\")' id='saveStartWorkflow_RequiredMitigantComentButton'>Yes</a></div><div class='col-50'><a href='#' class='button button-fill active' onclick='myApp.closeModal()' style='width:50%;'>No</a></div>";
        createPopup(popupContent,"","25%","25%","50%","50%");
        */
         var saveEventHandler='saveStartWorkflow_RequiredMitigantComent(\''+mainItemId+'\');';
         generateSaveCommentDeviationPopup(data.message + "</br></br>" + data.requiredMitigant + "</br></br>" + data.question,saveEventHandler);
    }
    else {
        myApp.alert(data.message + "</br></br>" + data.requiredMitigant + "</br>", "MACP");
    }
}

function manageRequiredDocumentResponse(data,mainItemId) {
    RequiredDocument = data.requiredDocument;
    DeviatedMsg = data.message;
    if (data.withDeviation === "true") {
        /*
        var popupContent=data.message + "</br></br>" + data.requiredDocument + "</br></br>" + data.question + "</br></div><div class='list-block' ><ul><li class='align-top'><div class='item-content'><div class='item-media'></div><div class='item-inner'><div class='item-input'><textarea id='deviationComment' onkeyup='saveStartWorkflow_RequiredDocumentComent_enabledButton(this)'></textarea></div></div></div></li></ul></<div><br><br><br><br><div class='row'><div class='col-50'><a href='#' class='button button-fill disabled' onclick='saveStartWorkflow_RequiredDocumentComent(\""+mainItemId+"\")' id='saveStartWorkflow_RequiredDocumentComentButton' style='width:50%; margin-left:50%' >Yes</a></div><div class='col-50'><a href='#' class='button button-fill active' onclick='myApp.closeModal()' style='width:50%;'>No</a></div>";
         createPopup(popupContent,"","25%","25%","50%","50%");
         */
         var saveEventHandler='saveStartWorkflow_RequiredDocumentComent(\''+mainItemId+'\');';
         generateSaveCommentDeviationPopup(data.message + "</br></br>" + data.requiredDocument + "</br></br>" + data.question,saveEventHandler);
    }
    else {
        myApp.alert(data.message + "</br></br>" + data.requiredDocument + "</br>", "MACP");
    }
}
function manageControlValidatorBehavior(data,mainItemId) {
    if (data.behavior === "blockingAlert") {
        myApp.alert(data.message, "Exception");
    }
    else if (data.behavior === "optionalAlert") {
        myApp.confirm(data.message, "Exception", function () {
            checkWorkflowEligibility(mainItemId);
        });
    }
    else if (data.behavior === "deviationAlert") {
        DeviatedMsg = data.message;
        var saveEventHandler='saveStartWFDeviationComment(\''+mainItemId+'\');';
        generateSaveCommentDeviationPopup(data.message,saveEventHandler);
    }
}
function checkWorkflowEligibility(mainItemId) {
    myApp.showPreloader();
    var popupWidth = window.innerWidth * 0.80;
    popupWidth = Math.floor(popupWidth);
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/CheckWorkflowEligibility';
    var data = "{" +
      "\"mainItemId\":\"" + mainItemId + "\"," +
      "\"subItem\":\"" + gSubItem + "\"," +
      "\"userData\":" + sessionStorage.getItem("userData") + "," +
      "\"workflowId\":\"" + WorkflowId + "\"," +
      "\"workflowName\":\"" + WorkFlowName + "\"," +
      "\"popupWidth\":\"" + popupWidth + "\"}";
    myApp.showPreloader();
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.status === "ok") {
                myApp.hidePreloader();
                myApp.closeModal(".popup", true);
                manageStartWorkFlowItemResponse(data,mainItemId);

            }
            else {
                myApp.hidePreloader();
            }
        },
        error: function (e) {

            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });

}
function saveStartWFDeviationComment(mainItemId) {
    var comment = document.getElementById("startWFdeviationComment").value;
    myApp.showPreloader();
    var popupWidth = window.innerWidth * 0.80;
    popupWidth = Math.floor(popupWidth);
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveDeviationCommentOnStartWorkflow';
    var data = "{" +
      "\"userData\":" + sessionStorage.getItem("userData") + "," +
       "\"mainItemId\":\"" + mainItemId + "\"," +
       "\"subItem\":\"" + gSubItem + "\"," +
       "\"workflowId\":\"" + WorkflowId + "\"," +
       "\"workflowName\":\"" + WorkFlowName + "\"," +
       "\"popupWidth\":\"" + popupWidth + "\"," +
       "\"deviationMsg\":\"" + comment + "\"," +
       "\"errorMsg\":\"" + DeviatedMsg + "\"}";
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.status === "ok") {

                myApp.hidePreloader();
                myApp.closeModal(".popup", true);
                manageStartWorkFlowItemResponse(data,mainItemId);
            }
            else {
                myApp.hidePreloader();
            }
        },
        error: function (e) {

            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });
}

function saveStartWorkflow_EligibilityComment(mainItemId) {
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveEligibilityCommentAndStartWorkflow';
    var data = "{" +
        "\"userData\":" + sessionStorage.getItem("userData") + "," +
        "\"mainItemId\":\"" + mainItemId + "\"," +
        "\"subItem\":\"" + gSubItem + "\"," +
        "\"workflowName\":\"" + WorkFlowName + "\"," +
        "\"workflowId\":\"" + WorkflowId + "\"," +
        "\"eligibilityObject\":" + JSON.stringify(StartWfEligibilityObject) + "," +
        "\"commentList\":" + JSON.stringify(getCommentsList()) + "}";
    myApp.showPreloader();
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.status === "ok") {
                myApp.hidePreloader();
                myApp.closeModal(".popup", true);
                manageStartWorkFlowItemResponse(data,mainItemId);
            }
            else {
                myApp.hidePreloader();
            }
        },
        error: function (e) {

            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });
}

function saveStartWorkflow_RequiredMitigantComent(mainItemId) {
    var comment = document.getElementById("deviationComment").value;
    myApp.showPreloader();
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveRequiredMitigantCommentOnStartWorkflow';
    var data = "{" +
        "\"userData\":" + sessionStorage.getItem("userData") + "," +
        "\"deviatedMsg\":\"" + DeviatedMsg + "\"," +
        "\"requiredDocument\":\"\"," +
        "\"requiredMitigant\":\"" + RequiredMitigant + "\"," +
        "\"mainItemId\":\"" + mainItemId + "\"," +
        "\"subItem\":\"" + gSubItem + "\"," +
        "\"workflowId\":\"" + WorkflowId + "\"," +
        "\"workflowName\":\"" + WorkFlowName + "\"," +
        "\"comment\":\"" + comment + "\"}";

    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.status === "ok") {
                myApp.hidePreloader();
                myApp.closeModal(".popup", true);
                manageStartWorkFlowItemResponse(data,mainItemId);

            }
            else {
                myApp.hidePreloader();
                myApp.alert("error occured", "Error");
            }
        },
        error: function (e) {

            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });
}

function saveStartWorkflow_RequiredDocumentComent(mainItemId) {
    var comment = document.getElementById("deviationComment").value;
    myApp.showPreloader();
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveRequiredDocumentCommentOnStartWorkflow';
    var data = "{" +
        "\"userData\":" + sessionStorage.getItem("userData") + "," +
        "\"deviatedMsg\":\"" + DeviatedMsg + "\"," +
        "\"requiredDocument\":\"" + RequiredDocument + "\"," +
        "\"requiredMitigant\":\"\"," +
        "\"mainItemId\":\"" + mainItemId + "\"," +
        "\"subItem\":\"" + gSubItem + "\"," +
        "\"workflowId\":\"" + WorkflowId + "\"," +
        "\"workflowName\":\"" + WorkFlowName + "\"," +
        "\"comment\":\"" + comment + "\"}";

    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.status === "ok") {
                myApp.hidePreloader();
                myApp.closeModal(".popup", true);
                manageStartWorkFlowItemResponse(data,mainItemId);

            }
            else {
                myApp.hidePreloader();
                myApp.alert("error occured", "Error");
            }
        },
        error: function (e) {

            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    });
}

function getCommentsList() {
    var commentlist = {};
    for (var j = 0; j < StartWfEligibilityObject.length; j++) {
        var element = document.getElementById("endTaskComment__" + StartWfEligibilityObject[j].eligibility_criteria_id);
        var comment = element.value;
        commentlist[StartWfEligibilityObject[j].eligibility_criteria_id] = comment;
    }

    return commentlist;
}