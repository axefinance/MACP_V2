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
                myApp.alert("error occured");
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
                    myApp.alert("error deleting");
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
        if(RelatedItemType==="condition")
            {
              mainView.router.load({url: 'pricingConditionScreen.html',reload:false,ignoreCache:true});
            }
        else 
            mainView.router.load({url: 'relatedItemScreen.html',reload:false,ignoreCache:true}); 
        //myApp.showPreloader();
        /*
        var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetRelatedItemScreen";    
            
      var data="{"+    
        "\"screenName\":\""+divId+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"relatedItemId\":\""+relatedItemId+"\"}"; 
    console.log("SearchParams",data);        
    $.ajax({             
        type: 'POST',             
        url: url,                                     
        contentType: "text/plain",                            
        dataType: "json",                            
        data: data,         
        success: function(data) {              
            myApp.popup('<div class="popup" style="width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important;  position:absoloute !important background : #f1f1f1 !important;" >' + data.content + '</div>', true);
                myApp.hidePreloader();   
        },
        error: function(e) { 
            myApp.hidePreloader();
            myApp.alert("error occured", "Error");        
        }           
    });  
    */
}
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
                myApp.alert("error occured", "Error");
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
                myApp.alert(data.status, function () {
                    loadScreen(divId);
                });
            },
            error: function (e) {
                myApp.hidePreloader();
                myApp.alert("error occured", "Error");
            }
        });
    }


    function menuTabClick(divID, butDiv, screenEngine) {
        divId = divID;
        engine = screenEngine;
        isUpdateAttachment = false;
        $("button").siblings(".selectedTab").removeClass('selectedTab');
        $('#' + butDiv).addClass('selectedTab');
        if (!($('#' + butDiv).hasClass('loaded'))) {
            $('#' + butDiv).addClass('loaded');
            loadScreen(divID);
        }

        $("div").siblings(".Active").removeClass('Active');

        $('#' + divID).addClass('Active');
        switch (screenEngine) {
 
            case "classicre":
                document.getElementById("saveBlock").classList.add("displayNone");
                document.getElementById("editBlock").classList.remove("displayNone");
                document.getElementById("startWfBlock").classList.remove("displayNone");
                break;
            case "classicms":
                document.getElementById("editBlock").classList.add("displayNone");
                document.getElementById("saveBlock").classList.remove("displayNone");
                document.getElementById("startWfBlock").classList.remove("displayNone");
                break;
            case "attachment":
                document.getElementById("saveBlock").classList.remove("displayNone");
                document.getElementById("editBlock").classList.remove("displayNone");
                document.getElementById("startWfBlock").classList.remove("displayNone");
                break;
            case "wflifecycle":
                document.getElementById("saveBlock").classList.add("displayNone");
                document.getElementById("editBlock").classList.add("displayNone");
                document.getElementById("startWfBlock").classList.add("displayNone");
                break;
        }
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
                myApp.alert("error occured");
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
                    myApp.alert('Unable to save file in path ' + folderpath);
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
        UpdateItem();
    }

    function attachement_SaveEvent() {
        setTimeout(uploadAttachementFile(), 1000);
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
                    myApp.alert(msg, function () {
                        loadScreen(divId);

                    });
                    myApp.closeModal(".popup", true);

                } else {
                    myApp.hidePreloader();
                    myApp.alert("error saving");
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
                    myApp.alert("error saving");
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
                myApp.alert(data.message);
            },
            error: function (e) {
                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                myApp.alert("error occured");


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
 