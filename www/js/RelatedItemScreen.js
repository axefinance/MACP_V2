function relatedItemSaveButtonClick(msg,msgTitle,mainItemId,screenName,relatedItemId) {
    SuccessMsg = msg;
    SuccesMsgTitle = msgTitle;
    var isValidForm = requiredFormComponent();
    if(isValidForm){                          
        var formData = myApp.formToData('#my-relatedItemPopup-form');
        Parameters = JSON.stringify(formData);           
        UpdateRelatedItemEvent(mainItemId,screenName,relatedItemId);          
    }
}

function UpdateRelatedItemEvent(mainItemId,screenName,relatedItemId) {
            if (isDuplicate === "isDuplicate")
                relatedItemId = 0;
            var data = "{" +
               "\"mainItemId\":\"" + mainItemId + "\"," +
               "\"relatedItemId\":\"" + relatedItemId + "\"," +
               "\"screenName\":\"" + screenName + "\"," +
               "\"ipAddress\":\"" + sessionStorage.getItem("Ip_config") + "\"," +
               "\"userData\":"+sessionStorage.getItem("userData")+"," +
               "\"parameters\":" + Parameters + "}";
            myApp.showPreloader();
            var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveRelatedItemEvent';

            $.ajax({
                type: 'POST',
                url: url,
                contentType: "text/plain",
                dataType: "json",
                data: data,
                success: function (data) {

                    if (data.status === "ok") {
                        myApp.hidePreloader();
                        manageSaveRelatedItemResponse(data,screenName,mainItemId,relatedItemId);
                    }
                    else {
                        myApp.hidePreloader();
                        myApp.alert("error saving", "Error");
                    }
                },
                error: function (e) {
 
                    
                    verifconnexion = false;
                    myApp.hidePreloader();
            errorMessage(e.message); 


                }
            });

        }

function UpdateRelatedItem(screenName,mainItemId,relatedItemId) {
            if (isDuplicate === "isDuplicate")
                updateId = 0;
            var data = "{" +
               "\"mainItemId\":\"" + mainItemId + "\"," +
               "\"relatedItemId\":\"" + relatedItemId + "\"," +
               "\"screenName\":\"" + screenName + "\"," +
               "\"userData\":"+sessionStorage.getItem("userData")+"," +
               "\"ipAddress\":\"" + sessionStorage.getItem("Ip_config") + "\"," +
               "\"parameters\":" + Parameters + "}";
            myApp.showPreloader();
            var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveRelatedItem';

            $.ajax({
                type: 'POST',
                url: url,
                contentType: "text/plain",
                dataType: "json",
                data: data,
                success: function (data) {
                    if (data.status === "ok") {
                        myApp.hidePreloader();
                        myApp.alert(SuccessMsg,"MACP", function () {
                            loadScreen(screenName,gMainItemId,gSubItem,"classicre");
                             mainView.router.back({reloadPrevious:true});
                        });
                    }
                    else {
                        myApp.hidePreloader();
                        myApp.alert(data.message, data.messageTitle);
                    }
                },
                error: function (e) {
                    verifconnexion = false;
                    myApp.hidePreloader();
                    errorMessage(e.message);
                }
            });
        }

function manageSaveRelatedItemResponse(data,screenName,mainItemId,relatedItemId) {
            if (data.behavior != null) {

                switch (data.behavior) {
                    case "blockingAlert":
                        {
                            myApp.alert(data.message, "Exception");
                            break;
                        }
                    case "optionalAlert":
                        {
                            myApp.confirm(data.message, "Exception", function () {
                                UpdateRelatedItem(screenName,mainItemId,relatedItemId);
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                            errorMsg = data.message;
                            var saveEventHendler='saveBeforeUpdateRelatedItem_DeviationComment(\''+screenName+'\',\''+mainItemId+'\',\''+relatedItemId+'\');';
                            generateSaveCommentDeviationPopup(data.message,saveEventHendler);
                            break;
                        }
                }
            } 
            else {

                myApp.hidePreloader();
                myApp.alert(SuccessMsg, SuccesMsgTitle, function () {
                loadScreen(gScreenName,gMainItemId,gSubItem,"classicre");
                mainView.router.back({reloadPrevious:true});
                });
                myApp.closeModal(".popup", true);
            }
        }

function saveProcessEngineComment_enabledButton(textarea) {

            var saveProcessEngineCommentButton = document.getElementById("saveProcessEngineCommentButton");
            if (textarea.value.length != 0) {
                saveProcessEngineCommentButton.className = "button button-fill active";
            }
            else {
                saveProcessEngineCommentButton.className = "button button-fill disabled";
            }


        };

function saveBeforeUpdateRelatedItem_DeviationComment(item,mainItemId,relatedItemId) {
            var comment = document.getElementById("deviationComment").value;
            var updateId = relatedItemId;
            if (isDuplicate === "isDuplicate")
                updateId = 0;
            var data = "{" +
                "\"screenName\":\"" + item + "\"," +
                "\"userData\":"+sessionStorage.getItem("userData")+"," +
                "\"mainItemId\":\"" + mainItemId + "\"," +
                "\"relatedItemId\":\""+relatedItemId+"\"," +
                "\"comment\":\"" + comment + "\"," +
                "\"errorMsg\":\"" + errorMsg + "\"," +
                "\"parameters\":" + Parameters + "}";
            myApp.showPreloader();
            var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveBeforeUpdateRelatedItem_LogDeviation';

            $.ajax({
                type: 'POST',
                url: url,
                contentType: "text/plain",
                dataType: "json",
                data: data,
                success: function (data) {

                    if (data.status === "ok") {
                        myApp.hidePreloader();
                        myApp.closeModal();
                        myApp.alert(SuccessMsg, SuccesMsgTitle, function () {
                           loadScreen(gScreenName,gMainItemId,gSubItem,"classicre");
                             mainView.router.back({reloadPrevious:true});
                        });
                    }
                    else {
                        myApp.hidePreloader();
                        myApp.alert(data.message, messageTitle);
                    }
                },
                error: function (e) {

                    
                    verifconnexion = false;
                    myApp.hidePreloader();
            errorMessage(e.message);


                }
            });
        }