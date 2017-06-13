// JavaScript source code
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

function generateAttachmentPicture(name, folder, subFolder){
     myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/GetDocumentAttachedStream';
        var data = "{" +
            "\"mainItemId\":\"" + itemId + "\"," +
            "\"screenName\":\"" + divId + "\"," +
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
                            myApp.popup('<div class="popup" style="width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important;  position:absoloute !important background : #f1f1f1 !important;" ><img src="' +fileHeader+ data.content + '"/></div>', true);                            
                    }
            },
            error: function (e) {

                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage();  
            }
        });
}


function deleteAttachmentDocument(name, folder, subFolder) {
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/DeleteAttachmentDocument';
        var data = "{" +
            "\"mainItemId\":\"" + itemId + "\"," +
            "\"screenName\":\"" + divId + "\"," +
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
                    loadScreen(divId);
                } else {
                    myApp.hidePreloader();
                    myApp.alert("error deleting","Error");
                }
            },
            error: function (e) {

                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage();
            }
        });

    }

function loadRelatedItemPopup(id, isDuplicateAction,relatedItemType) {
    if (engine === "attachment") {
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
        
     relatedItemId = id;
        isDuplicate = isDuplicateAction;
        if(divId.indexOf('_condition') > -1)
            {
              mainView.router.load({url: 'pricingConditionScreen.html',reload:false,ignoreCache:true});
              EditableGridObject=PricingConditionEdiatbelegrids;    
            }
        else 
        {
          mainView.router.load({url: 'relatedItemScreen.html',reload:false,ignoreCache:true}); 
          EditableGridObject=RelatedItemEdiatbelegrids;
}}
}

function manageAttechementElement() {
    document.getElementById("uploadBtn").onchange = function () {
        document.getElementById("uploadFile").value = this.value;
        var file = this.files[0];
        fileUploadedName = file.name;
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            console.log("read success");
            console.log(evt.target.result);
            fileUploadedData = evt.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    }
}
    function loadScreen(divID) {
        var data = "{" +
           "\"userData\":"+sessionStorage.getItem("userData")+","+
           "\"screenName\":\"" + divId + "\"," +
           "\"screenParent\":\"" + currentItem + "\"," + 
           "\"mainItemId\":\"" + itemId + "\"," +
           "\"taskId\":\""+TaskId+"\"," +
           "\"screenEngine\":\"" + engine + "\"," +
           "\"screenWidth\":\"" + window.innerWidth + "\"," +
           "\"screenHeight\":\"" + window.innerHeight + "\"}";
        myApp.showPreloader();
        $.ajax({
            type: "POST",
            url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetLoadEditTabFrame",
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                document.getElementById(divID).innerHTML = data.content;
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
                            document.getElementById(divID).innerHTML = data.content;
                            RelatedItemType=data.screenName; 
                            myApp.hidePreloader();
                            break; 
                        }
                    case ("classicms"):
                        {
                            document.getElementById(divID).innerHTML = data.content;
                            myApp.hidePreloader();
                            break;
                        }
                    case ("wflifecycle"):
                        {
                            document.getElementById(divID).innerHTML = data.content;
                            myApp.hidePreloader();
                            break;
                        }
                }

            },
            error: function (e) {
                myApp.hidePreloader();
                errorMessage();
            }
        });
        
    }



    function deleteRelatedItem(id, culture, confirmationMessage) {
        myApp.confirm(confirmationMessage, function () {
            deleteItem(id, culture);
        });
    }


    function deleteItem(id, culture) {
        var data = "{" +
       "\"screenName\":\"" + divId + "\"," +
       "\"itemId\":\"" + id + "\"," +
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
                    loadScreen(divId);
                });
            },
            error: function (e) {
                myApp.hidePreloader();            
                errorMessage();   
            }
        });
    }


    function menuTabClick(divID, butDiv, screenEngine) {
        divId = divID;
        engine = screenEngine;
        isUpdateAttachment = false;
        var selectedDivId ;
        selectedDivId = $("div").siblings(".Active").attr("id");
        $("button").siblings(".selectedTab").removeClass('selectedTab');
        $('#' + butDiv).addClass('selectedTab');
        if (!($('#' + butDiv).hasClass('loaded'))) {
            $('#' + butDiv).addClass('loaded');
            loadScreen(divID);
        }
        $("div").siblings(".Active").removeClass('Active');
        $('#' + divID).addClass('Active');
        $('#'+divID+'_buttons').removeClass("displayNone");
        $('#'+selectedDivId+'_buttons').addClass("displayNone");
        if(screenEngine==="classicms")
         EditableGridObject= MainItemEdiatbelegrids;  

    } 

    $$('.startWF-From-Edit-Screen-form-to-data').on('click', function () {

        startWorkflow_ButtonAction(itemId);
    });


    function generateDocumentMenu() {

        myApp.popup('<div id="documentMenuPopup" class="popup" style="width: 60% !important; top: 10% !important;left: 20% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" >' + docMenu + '</div>', true);
    }

    function generateDocument(documentName, item, fileType) {
        myApp.showPreloader();
        var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/ExportReport";

        var data = "{" +
            "\"entityType\":\"" + item + "\"," +
            "\"fileName\":\"" + documentName + "\"," +
            "\"format\":\""+fileType+"\"," +
            "\"itemID\":\"" + itemId + "\"," +
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
                errorMessage();
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

        console.log("Starting to write the file :3");

        window.resolveLocalFileSystemURL(folderpath, function (dir) {
            console.log("Access to the directory granted succesfully");
            dir.getFile(filename, {
                create: true
            }, function (file) {
                console.log("File created succesfully.");
                file.createWriter(function (fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.write(DataBlob);

                }, function () {
                    myApp.alert('Unable to save file in path ' + folderpath,"Error");
                });
            });
        });
        myApp.hidePreloader();
        window.open(folderpath + "//" + filename, "_system", 'location=yes');
    }

    $$('.edit-mainData-form-to-data').on('click', function () {
        var indexToSelect = 1;
        if (engine === "classicms") {
            formId = "#my-mainData-form";

        } else if (engine === "attachment") {
            formId = "#my-attachment-form";
        }
         var isValidForm = requiredFormComponent(formId); 

       /* if (!isValid) {
            $(x[indexToSelect]).next().children().first().focus();
        } else {*/
        if(isValidForm){
            if (engine === "classicms") {
                mainData_SaveEvent();
            } else if (engine === "attachment") {
                attachement_SaveEvent();
            }
        }
    });


function mainData_SaveEvent() {
        var formData = myApp.formToData('#my-mainData-form');
        Parameters = JSON.stringify(formData);
        UpdateItemEvent();
    }

    function attachement_SaveEvent() {
        uploadAttachementFile();
    }



    function UpdateRelatedItem(msg) {
        var updateId = relatedItemId;
        if (isDuplicate === "isDuplicate"||isDuplicate==="isNew")
            updateId = 0;
        var data = "{" +
            "\"mainItemId\":\"" + itemId + "\"," +
            "\"relatedItemId\":\"" + updateId + "\"," +
            "\"screenName\":\"" + divId + "\"," +
            "\"userId\":\"" + sessionStorage.getItem("userId") + "\"," +
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
                    myApp.alert(msg,"MACP", function () {
                        loadScreen(divId);

                    });
                    myApp.closeModal(".popup", true);

                } else {
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error");
                }
            },
            error: function (e) {

                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage();


            }
        });
    }

    function uploadAttachementFile() {
        var formData = myApp.formToData('#my-attachment-form');
        parameters = JSON.stringify(formData);
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/AttachFile';
        var data = "{" +
            "\"mainItemId\":\"" + itemId + "\"," +
            "\"screenName\":\"" + divId + "\"," +
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
                    loadScreen(divId);
                } else {
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error");
                }
            },
            error: function (e) {

                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage();
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

    function fileDetail(name, type, status, description, rejectionComment, expiryDate, dateFormat, folder, subFolder, buttonListMenu) {

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
                var funcClick = function () { deleteAttachmentDocument(name, folder, subFolder)}
                valueToPush["onClick"] = funcClick;
                valueToPush["color"] = "red";
            }
            if(butType === "preview")
            {
               /* var res = name.split(".");                
                var fileType = res[res.length-1];
                switch(fileType)
                    case "png" : 
                        var funcClick = function () { generateAttachmentPicture(name, folder, subFolder)}            
                        break;
                    case "pdf" : */
                        var funcClick = function () { generateAttachmentPicture(name, folder, subFolder)}            
                       // break;
                
                valueToPush["onClick"] = funcClick;             
            }
            buttonsGroup.push(valueToPush);
        }
        myApp.actions(buttonsGroup);
    }


    function UpdateItem() {

        var data = "{" +
            "\"mainItemId\":\"" + itemId + "\"," +
            "\"screenName\":\"" + currentItem + "\"," +
            "\"userData\":"+sessionStorage.getItem("userData")+"," +
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
                myApp.alert(data.message,"MACP");
            },
            error: function (e) {
                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                errorMessage();
            }
        });
    }

       

        function downloadAsset(fileName) {
            var assetURL = "https://raw.githubusercontent.com/cfjedimaster/Cordova-Examples/master/readme.md";
            var store = cordova.file.dataDirectory;
            var fileTransfer = new FileTransfer();
            fileTransfer.download(assetURL, store + fileName,
                function (entry) {
                    console.log("Success!");
                },
                function (err) {
                    console.log("Error");
                });
        }


 function UpdateItemEvent() {

        var data = "{" +
            "\"mainItemId\":\"" + itemId + "\"," +
            "\"screenName\":\"" + currentItem + "\"," +
            "\"userData\":"+sessionStorage.getItem("userData")+","+
            "\"ipAddress\":\"" + sessionStorage.getItem('Ip_config') + "\"," +
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
                manageUpdateItemResponse(data);
                 }
                
            },
            error: function (e) {
                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                myApp.alert("error occured");


            }  
        });
    }

function manageUpdateItemResponse(data) {
            console.log(data.behavior);
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
                                UpdateItem();
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                          errorMsg = data.message;
                            myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">' + data.message + '</br></br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveProcessEngineComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveBeforeUpdateItem_DeviationComment()" id="saveProcessEngineCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
                            break;
                                                                  
             
                                        
                        }
                }
            }
            else {

                myApp.hidePreloader();
                myApp.alert(data.message,"MACP");
            }
     }

    
    function saveBeforeUpdateItem_DeviationComment() {
            var comment = document.getElementById("deviationComment").value;
            var updateId = relatedItemId;
            if (isDuplicate === "isDuplicate")
                updateId = 0;
            var data = "{" +
                "\"screenName\":\"" + divId + "\"," +
                "\"userId\":\"" + sessionStorage.getItem("userId") + "\"," +
                "\"mainItemId\":\"" + itemId + "\"," +
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
                        myApp.closeModal();
                        myApp.alert(data.message);
                    }
                    else {
                        myApp.hidePreloader();
                        myApp.alert(data.message, messageTitle);
                    }
                },
                error: function (e) {

                    console.log(e.message);
                    verifconnexion = false;
                    myApp.hidePreloader();
                    myApp.alert("error occured");


                }
            });
        }