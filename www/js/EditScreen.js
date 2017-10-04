
var EditScreen_JSFlag;
var fileUploadedName;
var fileData;
var fileUploadedData;
var isDuplicate;
var Parameters;
var errorMsg;
var SuccessMsg;
var SuccesMsgTitle;
var isUpdateAttachment = false;
var RelatedItemType;
var clickedEditableGridId;
var clickedEditableGridColumnsCount;
var newEditableGridRows = [];

    function generateAttachmentPicture(name, folder, subFolder,parentItemId,screenName){
     myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/GetDocumentAttachedStream';
        var data = "{" +
            "\"mainItemId\":\"" + parentItemId + "\"," +
            "\"screenName\":\"" + screenName + "\"," +
            "\"fileName\":\"" + name + "\"," +
            "\"folder\":\"" + folder + "\"," +
            "\"subFolder\":\"" + subFolder + "\"}";
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                    myApp.hidePreloader();
                    var str = name.split('.');
                    var fileType = str[str.length-1];
                    var fileHeader;
                    switch (fileType.toLowerCase()){
                        case "pdf" :
                            fileHeader = "data:application/"+fileType+";base64,";
                            if (device.manufacturer.toLowerCase() === "apple") {                    
                                var ref = cordova.InAppBrowser.open("data:application/pdf;base64," + data.content, '_blank', 'location=no,closebuttoncaption=X,toolbarposition=top');
                            } else {
                                managePdfReaderInAndroid(name, data.content);
                            }
                            break; 
                        case "docx" : 
                            fileHeader = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,";
                            if (device.manufacturer.toLowerCase() === "apple") {                    
                                var ref = cordova.InAppBrowser.open(fileHeader + data.content, '_blank', 'location=no,closebuttoncaption=X,toolbarposition=top');
                            } else {
                                var folderpath = cordova.file.externalRootDirectory;
                                savebase64AsPDF(folderpath, name, data.content, fileHeader);
                            }
                            break;
                        case "png":
                        case "jpg":
                        case "jpeg":
                        case "gif":                                                        
                            fileHeader = "data:image/"+fileType+";base64,"                            
                            createPopup(fileHeader+ data.content,"","10%","10%","80%","80%");
                    }
            },
            error: function (e) {

                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage(e.message);  
            }
        });
}
    function deleteAttachmentDocument(name, folder, subFolder,parentItemId,engine,screenName) {
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/DeleteAttachmentDocument';
        var data = "{" +
            "\"mainItemId\":\"" + parentItemId + "\"," +
            "\"screenName\":\"" + screenName + "\"," +
            "\"fileName\":\"" + name + "\"," +
            "\"folder\":\"" + folder + "\"," +
            "\"subFolder\":\"" + subFolder + "\"," +
            "\"userShortName\":\"" + setUser_ShortName(sessionStorage.getItem("userShortName")) + "\"}";
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                if (data.status === "ok") {
                    myApp.hidePreloader();
                    
                    loadScreen(screenName,parentItemId,screenName,"attachment");
                    myApp.hidePreloader();
                    myApp.alert("error deleting","Error");
                }
            },
            error: function (e) {

                
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage(e.message);
            }
        });

    }
function loadRelatedItemPopup(relatedItemId, isDuplicateAction,mainItemId,subItem,relatedScreenName) {
       
    if (gEngine === "attachment") {
        isUpdateAttachment = false;
        var formData = {
            'o__none__file_name': '',
            'h__none__document_attachment_type': '',
            'h__none__document_attachment_status': '',
            'b__none__description_value': '',
            'b__none__rejection_comment': '',
            'f__none__document_expiry_date': '',
            'h__none__folder_name': '',
            'h__none__subfolder_name': ''
        }
        myApp.formFromData('#my-attachment-form', formData);
        $('#uploadFile').closest(".textbox").attr('disabled', false);
        $('#h__none__folder_name').closest(".combobox").attr('disabled', false);
        $("#h__none__subfolder_name").children().remove();
        $('#h__none__subfolder_name').closest(".combobox").attr('disabled', false);
    }
    else {  
        
        isDuplicate = isDuplicateAction;
        if(relatedScreenName.indexOf('_condition') > -1)
            { 

                if(!checkInternetConnection())                                                   
                    myApp.alert("please check your internet connection");
                else 
                    {
                    mainView.router.load({url: 'pricingConditionScreen.html',reload:false,ignoreCache:true});
                    gMainItemId=mainItemId;
                    gSubItem=subItem;
                    gRelatedItemId=relatedItemId;
                    gScreenName=relatedScreenName;
                    }
            }
        else 
        {
            if(!checkInternetConnection())                                                   
                myApp.alert("please check your internet connection");
            else 
                {
                   
                    gMainItemId=mainItemId;
                    gSubItem=subItem;
                    gRelatedItemId=relatedItemId;
                    gScreenName=relatedScreenName;
                    mainView.router.load({url: 'relatedItemScreen.html',reload:false,ignoreCache:true}); 
                }
}}
}
    function manageAttechementElement() {
    document.getElementById("uploadBtn").onchange = function () {
        document.getElementById("uploadFile").value = this.value;
        var file = this.files[0];
        fileUploadedName = file.name;
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            fileUploadedData = evt.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    }
}
    function loadScreen(screenName,mainItemId,subItem,engine) {
              var data = "{" +
           "\"userData\":"+sessionStorage.getItem("userData")+","+
           "\"screenName\":\"" + screenName + "\"," +
           "\"subItem\":\"" + subItem + "\"," + 
           "\"mainItemId\":\"" + mainItemId + "\"," + 
           "\"taskId\":\""+gTaskId+"\"," +
           "\"screenEngine\":\"" + engine + "\"," +
           "\"screenWidth\":\"" + window.innerWidth + "\"," +
           "\"screenHeight\":\"" + window.innerHeight + "\"}";
        myApp.showPreloader();
        if(gIsRelatedFromLink==="true")
            {
        
        $.ajax({ 
            type: "POST",
            url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetRelatedFrameFromLink",
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                document.getElementById("relatedScreenForm").innerHTML = data.content;  
                if($('#relatedScreen-toolbarContent div').length===0)
                 $('#relatedScreen-toolbarContent').append(data.buttonsDiv); 
                myApp.hidePreloader();  
            },
            error: function (e) {
                myApp.hidePreloader();
                errorMessage(e.message);
            }
        });
            }
        else  
            {
        $.ajax({
            type: "POST",
            url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetLoadEditTabFrame",
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                document.getElementById(screenName+"__"+mainItemId).innerHTML = data.content;
                loadJSFile("js/informativeGridInfiniteScroll.js");
                myApp.attachInfiniteScroll($$('.informativeGrid-infinite-scroll'));
                myApp.hidePreloader();
                switch (engine) {
                    case ("attachment"):
                        {
                            myApp.accordionOpen(".accordion-item");
                            manageAttechementElement();
                            break;
                        }
                    case ("classicre"):
                        {
                            document.getElementById(screenName+"__"+mainItemId).innerHTML = data.content;
                            myApp.hidePreloader();
                            break; 
                        }
                    case ("classicms"):
                        {
                            document.getElementById(screenName+"__"+mainItemId).innerHTML = data.content;
                            myApp.hidePreloader();
                            break;
                        }
                    case ("wflifecycle"):
                        {
                            document.getElementById(screenName+"__"+mainItemId).innerHTML = data.content;
                            myApp.hidePreloader();
                            break;
                        }
                }

            },
            error: function (e) {
                myApp.hidePreloader();
                errorMessage(e.message);
            }
        });
        
          }
    }
    function deleteRelatedItem(relatedItemId, mainItemId, culture, confirmationMessage,screenParent, screenName) {
        myApp.confirm(confirmationMessage,"MACP", function () {
            deleteItem(relatedItemId,mainItemId, culture,screenParent,screenName);
        });
    }
    function deleteItem(relatedItemId,mainItemId, culture,screenParent,screenName) {
        var data = "{" +
       "\"screenName\":\"" + screenName + "\"," +
       "\"itemId\":\"" + relatedItemId + "\"," +
       "\"beforeCheck\":\"false\"," +
       "\"remoteAddress\":\"\"," +
       "\"userData\":"+sessionStorage.getItem("userData")+","+
       "\"spName\":\"\"," +
       "\"groupingSetShortname\":\"\"," +
       "\"mcData\":\"\"}";
        myApp.showPreloader();
        $.ajax({
            type: "POST",
            url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/DeleteItem",
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                myApp.hidePreloader();
                myApp.alert(data.status,"MACP", function () {
                    loadScreen(screenName,mainItemId,screenParent,"classicre");    
                }); 
            },
            error: function (e) {
                myApp.hidePreloader();            
                errorMessage(e.message);   
            }
        });
    }
    function menuTabClick(screenName, butDiv, screenEngine,mainItemId,subItem) {
        gIsRelatedFromLink="false";
        gEngine = screenEngine;
        isUpdateAttachment = false;
        gScreenName=screenName;
        var selectedDivId ;
        selectedDivId = $('#' + screenName+"__"+mainItemId).siblings(".Active").attr("id");
        $("button").siblings(".selectedTab."+mainItemId).removeClass('selectedTab');
        $('#' + butDiv).addClass('selectedTab');
        if (!($('#' + butDiv).hasClass('loaded'))) {
            $('#' + butDiv).addClass('loaded');
            loadScreen(screenName,mainItemId,subItem,screenEngine);
        }
        $("#"+screenName+"__"+mainItemId).siblings(".Active").removeClass('Active');
        $('#' + screenName+"__"+mainItemId).addClass('Active');
        $('#'+screenName+'__'+mainItemId+'_buttons').removeClass("displayNone");
        $('#'+selectedDivId+'_buttons').addClass("displayNone");
        RelatedItemType=$(".selectedTab").text();  
    }
    function startworkflowButtonEvent(mainItemId) {
           startWorkflow_ButtonAction(mainItemId);
     } 
    function generateDocument(documentName, item, fileType,mainItemId) {
        myApp.showPreloader();
        var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/ExportReport";

        var data = "{" +
            "\"entityType\":\"" + item + "\"," +
            "\"fileName\":\"" + documentName + "\"," +
            "\"format\":\""+fileType+"\"," +
            "\"itemID\":\"" + mainItemId + "\"," +
            "\"userData\":"+sessionStorage.getItem("userData")+"}";
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data, 
            success: function (data) {
                if (device.manufacturer.toLowerCase() === "apple") {
                    myApp.hidePreloader();                                       
                    var ref = cordova.InAppBrowser.open("data:application/pdf;base64," + data.content, '_blank', 'location=no,closebuttoncaption=X,toolbarposition=top');
                } else {
                    managePdfReaderInAndroid(documentName, data.content);
                }
            },
            error: function (e) {
                myApp.hidePreloader();            
                errorMessage(e.message);
            }
        });
    }
    function managePdfReaderInAndroid(documentName, base64) {
        var folderpath = cordova.file.externalRootDirectory;
        var contentType = "application/pdf";
        savebase64AsPDF(folderpath, documentName, base64, contentType);
    }
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    }
    function savebase64AsPDF(folderpath, filename, content, contentType) {
        var DataBlob = b64toBlob(content, contentType);
        window.resolveLocalFileSystemURL(folderpath, function (dir) {
            dir.getFile(filename, {
                create: true
            }, function (file) {
                file.createWriter(function (fileWriter) {
                    fileWriter.write(DataBlob);

                }, function () {
                    myApp.alert('Unable to save file in path ' + folderpath,"Error");
                });
            });
        });
        myApp.hidePreloader();
        window.open(folderpath + "//" + filename, "_system", 'location=yes');
    }
    function saveButtonEvent(mainItemId,screenName,subItem,screenEngine) {
    var formId;    
    var indexToSelect = 1;
        if (screenEngine === "classicms") {
            formId = "#my-mainData-form__"+mainItemId; 

        } else if (screenEngine === "attachment" || screenEngine === "attachmentFromLink") {
            formId = "#my-attachment-form__"+mainItemId;
        }
         var isValidForm = requiredFormComponent(formId); 
        if(isValidForm){
            if (screenEngine === "classicms") {
                mainData_SaveEvent(mainItemId,subItem,screenName);
            } else if (screenEngine === "attachment" || screenEngine === "attachmentFromLink") {
                attachement_SaveEvent(mainItemId,subItem,screenName);
            }
        }
     }
    function mainData_SaveEvent(parentItemId,subItem,screenName) {
        var formData = myApp.formToData('#my-mainData-form__'+parentItemId);
        Parameters = JSON.stringify(formData);
        UpdateItemEvent(parentItemId,subItem,screenName);
    }
    function attachement_SaveEvent(mainItemId,subItem,screenName) {
        uploadAttachementFile(mainItemId,subItem,screenName);
    }
    function uploadAttachementFile(mainItemId,subItem,screenName) {
        var formData = myApp.formToData('#my-attachment-form__'+mainItemId);
        parameters = JSON.stringify(formData);
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/AttachFile';
        var data = "{" +
            "\"mainItemId\":\"" + mainItemId + "\"," +
            "\"subItem\":\"" + subItem + "\"," +
            "\"fileName\":\"" + fileUploadedName + "\"," +
            "\"fileData\":\"" + fileUploadedData + "\"," +
            "\"folder\":\"" + $("#h__none__folder_name option:selected").text() + "\"," +
            "\"subFolder\":\"" + $("#h__none__subfolder_name option:selected").text() + "\"," +
            "\"userData\":"+sessionStorage.getItem("userData")+"," +
            "\"parameters\":" + parameters + "}";
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                if (data.status === "ok") {
                    myApp.hidePreloader();
                    if(gEngine ==="attachment")
                        {
                            loadScreen(screenName,mainItemId,subItem,"attachment");
                        }
                    else
                        {
                            GetAttachmentScreen(screenName,mainItemId,subItem);
                        }
                    }
                    
                 else {
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error");
                }
            },
            error: function (e) {

                
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage(e.message);
            }
        });

    }
    function editFileDetail(name, type, status, description, rejectionComment, expiryDate, dateFormat, folder, subFolder) {
        isUpdateAttachment = true;
        fileUploadedName = name;
        if (type.localeCompare("") == 1) {
            $("#uploadFile").val(name);
            $('#uploadFile').closest(".textbox").attr('disabled', true);
        }
        if (type.localeCompare("") == 1)
            //$("#h__none__document_attachment_type").val(type);
            $("#h__none__document_attachment_type option").filter(function () {
                return $(this).text() == type;
            }).attr('selected', 'selected');
        if (status.localeCompare("") == 1)
            //$("#h__none__document_attachment_status").val(status);
            $("#h__none__document_attachment_status option").filter(function () {
                return $(this).text() == status;
            }).attr('selected', 'selected');

        if (description.localeCompare("") == 1)
            $("#b__none__description_value").val(description);
        if (rejectionComment.localeCompare("") == 1)
            $("#b__none__rejection_comment").val(rejectionComment);
        if (expiryDate.localeCompare("") == 1) {
            var year = expiryDate.split("/")[0];
            var month = expiryDate.split("/")[1];
            var day = expiryDate.split("/")[2];
            myApp.calendar({
                input: '#f__none__document_expiry_date',
                dateFormat: dateFormat,
                closeOnSelect: false,
                value: [new Date(year, month, day)]
            });
        }
        $('#h__none__folder_name').closest(".combobox").attr('disabled', true);
        $("#h__none__folder_name option.emptyOption").attr('selected', 'selected');
        if (folder.localeCompare("") == 1) {
            $("#h__none__folder_name option").filter(function () {
                return $(this).text() == folder;
            }).attr('selected', 'selected');

        }
        $("#h__none__subfolder_name").children().remove();
        $('#h__none__subfolder_name').closest(".combobox").attr('disabled', true);
        if (subFolder.localeCompare("") == 1) {
            $('#h__none__subfolder_name').append($("<option></option>").attr("value", subFolder).text(subFolder));
            $("#h__none__subfolder_name").filter(function () {
                return $(this).text() == subFolder;
            }).attr('selected', 'selected');
        }



    }
    function fileDetail(name, type, status, description, rejectionComment, expiryDate, dateFormat, folder, subFolder, buttonListMenu,parentItemId,screenName) {

        var buttonsGroup = [];
        var actionSheetTitle = {};
        actionSheetTitle["text"] = name;
        actionSheetTitle["label"] = true;
        buttonsGroup.push(actionSheetTitle);
        var buttonListObject = JSON.parse(buttonListMenu);
        for (var event in buttonListObject) {
            var valueToPush = {};
            var dataCopy = buttonListObject[event]
            var butType;
            var butDisplay;
            butType = dataCopy["type"];
            butDisplay = dataCopy["display"];
            valueToPush["text"] = butDisplay;
            if (butType === "edit") {
                var funcClick = function () { editFileDetail(name, type, status, description, rejectionComment, expiryDate, dateFormat, folder, subFolder); }
                valueToPush["onClick"] = funcClick;
            }
            if (butType === "delete") {
                var funcClick = function () { deleteAttachmentDocument(name, folder, subFolder,item,screenName)}
                valueToPush["onClick"] = funcClick;
                valueToPush["color"] = "red";
            }
            if(butType === "preview")
            {
                        var funcClick = function () { generateAttachmentPicture(name, folder, subFolder,parentItemId,screenName)}            
                valueToPush["onClick"] = funcClick;             
            }
            buttonsGroup.push(valueToPush);
        }
        myApp.actions(buttonsGroup);
    }
    function UpdateItem(parentItemId,screenName) {
      var stringify= getGridonPoponsData("#my-mainData-form");
        var data = "{" +
            "\"mainItemId\":\"" + parentItemId + "\"," +
            "\"screenName\":\"" + screenName + "\"," +
            "\"userData\":"+sessionStorage.getItem("userData")+"," +
            "\"stringify\":"+stringify+"," +
            "\"parameters\":" + Parameters + "}";
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/UpdateItem';

        $.ajax({
            type: 'POST', 
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                myApp.hidePreloader();
                ReinitGridOnPoponDataAfterSave("#my-mainData-form__"+parentItemId);
                myApp.alert(data.message,"MACP");
            },
            error: function (e) {
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage(e.message);
            }
        });
    }
    function downloadAsset(fileName) {
            var assetURL = "https://raw.githubusercontent.com/cfjedimaster/Cordova-Examples/master/readme.md";
            var store = cordova.file.dataDirectory;
            var fileTransfer = new FileTransfer();
            fileTransfer.download(assetURL, store + fileName,
                function (entry) {
                },
                function (err) {
                });
        }
    function UpdateItemEvent(parentItemId,subItem,screenName) {
    var stringify= getGridonPoponsData("#my-mainData-form__"+parentItemId);
        var data = "{" +
            "\"mainItemId\":\"" + parentItemId + "\"," +
            "\"screenName\":\"" + screenName + "\"," +
            "\"userData\":"+sessionStorage.getItem("userData")+","+
            "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
            "\"stringify\":"+stringify+"," +
            "\"parameters\":" + Parameters + "}";
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/UpdateItemEvent';

        $.ajax({
            type: 'POST',   
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                 if (data.status === "ok") {
                myApp.hidePreloader();
                manageUpdateItemResponse(data,parentItemId,screenName);
                 }
                
            },
            error: function (e) {
                verifconnexion = false;
                myApp.hidePreloader();
                myApp.alert("error occured");


            }  
        });
    }
    function manageUpdateItemResponse(data,parentItemId,screenName) {
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
                                UpdateItem(parentItemId,screenName);
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                          errorMsg = data.message;
                            var saveEventHendler='saveBeforeUpdateItem_DeviationComment(\''+parentItemId+'\',\''+screenName+'\');';
                            generateSaveCommentDeviationPopup(data.message,saveEventHendler);
                            break;
                                                                  
             
                                        
                        }
                }
            }
            else {

                myApp.hidePreloader();
                ReinitGridOnPoponDataAfterSave("#my-mainData-form__"+parentItemId);
                myApp.alert(data.message,"MACP");
            }
     }
    function saveBeforeUpdateItem_DeviationComment(parentItemId,screenName) {
            var comment = document.getElementById("deviationComment").value;
            var data = "{" +
                "\"screenName\":\"" + screenName + "\"," +
                "\"userData\":"+sessionStorage.getItem("userData")+","+
                "\"mainItemId\":\"" + parentItemId + "\"," +
                "\"relatedItemId\":\"0\"," +
                "\"comment\":\"" + comment + "\"," +
                "\"errorMsg\":\"" + errorMsg + "\"," + 
                "\"parameters\":" + Parameters + "}";
            myApp.showPreloader();
            var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/SaveBeforeUpdateItem_LogDeviation';

            $.ajax({
                type: 'POST', 
                url: url,  
                contentType: "text/plain",
                dataType: "json",
                data: data,
                success: function (data) {
  
                    if (data.status === "ok") {
                        myApp.hidePreloader();
                        ReinitGridOnPoponDataAfterSave("#my-mainData-form__"+parentItemId);
                        myApp.closeModal();
                        myApp.alert(data.message);
                        
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
    function generateDocumentMenu(screenName,mainItemId,taskId,subItem) {
        myApp.showPreloader();            
        var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetDocumentMenu";
        var data = "{" +
            "\"subItem\":\"" + subItem + "\"," +
            "\"screenName\":\"" + screenName + "\"," +
            "\"mainItemId\":\"" + mainItemId + "\"," +
            "\"taskId\":\""+taskId+"\"}";
        $.ajax({
            type: 'POST',
            url: url,  
            contentType: "text/plain",
            dataType: "json",
            data: data, 
            success: function (data) {
                myApp.hidePreloader();   
                if(data.DocumentMenu!="")                            
                    createPopup(data.DocumentMenu,"","20%","20%","60%","60%");
            },
            error: function (e) {
                myApp.hidePreloader();             
                errorMessage(e.message); 
            }
        });
    }
    function loadEditScreen(withBackButton,mainItemId){
            if(withBackButton===true)
                {
                 backButtonHtml=  '<a id="backButton" href="#" class="back link">'+
             '<i class="icon icon-back"></i>'+
             '<span>Back</span>'+
               '</a>' ;
                }
            else
                {
                backButtonHtml="";
                }
     var editScreenContent = '<div class="navbar">'+
             '<div class="navbar-inner">'+
             '<div class="left">'+
              backButtonHtml+
             '<a class="navbarUserIcon navbarButton link create-profile-links-editScreen__'+mainItemId+'" id="userName_label_editScreen__'+mainItemId+'" aria-hidden="true">'+
             'User</a>'+
             '</div>'+ 
             '<div id="title_editScreen__'+mainItemId+'" class="center sliding">Search</div>'+
             '<div class="right">'+
             '<a id="lng_label_editScreen__'+mainItemId+'" class="navbarGlobeIcon link create-language-links-editScreen__'+mainItemId+' navbarButton" aria-hidden="true">'+
             'EN</a>'+
             '<a href="#" class="link icon-only open-panel navbarWestMenuIcon"></a>'+
             '</div>'+
             '</div>'+
             '<div class="pages">'+
             '<div data-page="editScreen" class="page" >'+ 
             '<div class="page-content" >'+
             '<div id="editScreenForm" class="newPage">'+
             '<div id="editScreenForm__'+mainItemId+'" ></div>'+    
             '</div>'+      
             '</div>'+      
             '<div class="toolbar">'+
             '<div id="edit-toolbarContent__'+mainItemId+'" class="toolbar-inner" style="align-parent:rigth !important" >'+  
             '</div>'+  
             '</div>'+
             '</div>'+               
             '</div>'; 
        mainView.router.loadContent(editScreenContent);
      
}