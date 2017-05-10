var EditScreen_JSFlag;
var relatedItemId;
var fileUploadedName;
var fileData;
var fileUploadedData;
var isDuplicate;
var Parameters;
var errorMsg;
var SuccessMsg;
var SuccesMsgTitle;
function loadRelatedItemPopup(id,isDuplicateAction)
{ 
       relatedItemId=id;
       isDuplicate=isDuplicateAction;

       myApp.showPreloader(); 
            $.ajax({ 
                    type: "GET", 
                    dataType:"json",   
                    url: "http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/GetRelatedItemScreen/"+divId+"/"+itemId+"/"+id,
                    success: function(data) { 
                        myApp.popup('<div class="popup" style="width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" >'+data.content+'</div>', true);
                        myApp.hidePreloader();
                    }, 
                    error: function(e) {
                        myApp.hidePreloader();
                       myApp.alert("error occured","Error");       
                    }        
            });   
}


function manageAttechementElement()
{
    document.getElementById("uploadBtn").onchange = function () {
    document.getElementById("uploadFile").value = this.value;
   var file=this.files[0];
    fileUploadedName=file.name;
   var reader  = new FileReader();
     reader.onloadend = function(evt) {
        console.log("read success");
        console.log(evt.target.result);
        fileUploadedData= evt.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
} 
            
}        
    


function loadScreen(divID)     {    
     var data="{"+             
        "\"screenName\":\""+divId+"\","+ 
        "\"mainItemId\":\""+itemId+"\"," +
        "\"screenEngine\":\""+engine+"\","+
        "\"screenWidth\":\""+window.innerWidth+"\"," +
        "\"screenHeight\":\""+window.innerHeight+"\"}"; 
       myApp.showPreloader(); 
            $.ajax({    
                    type: "POST", 
                    url: "http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/GetLoadEditTabFrame",
                    contentType: "text/plain",                          
                    dataType: "json",                      
                    data: data, 
                    success: function(data) { 
                        document.getElementById(divID).innerHTML=data.content; 
                        myApp.hidePreloader();
                        switch(engine)
                            {
                                case ("attachment") :
                                    {
                                     myApp.accordionOpen(".accordion-item");
                                     manageAttechementElement();
                                     break;
                                    }
                                case ("classicre") :
                                case ("classicms") :
                                    {
                                    document.getElementById(divID).innerHTML=data.content;       
                                    myApp.hidePreloader();
                                    break;
                                     }
                            }
 
                    },   
                    error: function(e) {
                       myApp.hidePreloader();
                       myApp.alert("error occured","Error"); 
                    }   
            });             
}
           
function deleteRelatedItem(id, culture, confirmationMessage)
{
        myApp.confirm(confirmationMessage, function () { 
            deleteItem(id,culture);
    });
}

function deleteItem(id,culture){
         var data="{"+             
        "\"screenName\":\""+divId+"\","+
        "\"itemId\":\""+id+"\"," +
        "\"beforeCheck\":\"false\"," +
        "\"remoteAddress\":\"\","+
        "\"culture\":\""+sessionStorage.getItem("language")+"\"," +
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"," +
        "\"spName\":\"\","+
        "\"groupingSetShortname\":\"\","+            
        "\"mcData\":\"\"}"; 
       myApp.showPreloader();
            $.ajax({  
                    type: "POST", 
                    url: "http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/DeleteItem",
                    contentType: "text/plain",                          
                    dataType: "json",                      
                    data: data, 
                    success: function(data) {                            
                        myApp.hidePreloader();
                        myApp.alert(data.status, function () {                        
                            loadScreen(divId);      
                        });
                    },    
                    error: function(e) {
                        myApp.hidePreloader();
                       myApp.alert("error occured","Error");  
                    }   
            });     
}

function menuTabClick(divID,butDiv,screenEngine){         
    divId=divID;
    engine=screenEngine;
    $("button").siblings(".selectedTab").removeClass('selectedTab');                
    $('#'+butDiv).addClass('selectedTab');   
    if(!($('#'+butDiv).hasClass('loaded')))  
    {
        $('#'+butDiv).addClass('loaded');             
        loadScreen(divID);
    }

    $("div").siblings(".Active").removeClass('Active');

    $('#'+divID).addClass('Active'); 
    switch(screenEngine){ 
           
        case "classicre" : 
            document.getElementById("saveBlock").classList.add("displayNone");
            document.getElementById("editBlock").classList.remove("displayNone");
            break;
        case "attachment":    
        case "classicms":
            document.getElementById("editBlock").classList.add("displayNone");
            document.getElementById("saveBlock").classList.remove("displayNone");
            break;
    }
     
}
  

$$('.startWF-From-Edit-Screen-form-to-data').on('click', function(){
    
    startWorkflow_ButtonAction(itemId);
});


function generateDocumentMenu(){
   
myApp.popup('<div id="documentMenuPopup" class="popup" style="width: 60% !important; top: 10% !important;left: 20% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" >'+docMenu+'</div>', true);
}

function generateDocument(documentName,item){
    myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/ExportReport";
    
          var data="{"+  
        "\"entityType\":\""+item+"\"," +
        "\"fileName\":\""+documentName+"\"," +
        "\"format\":\"pdf\","+
        "\"itemID\":\""+itemId+"\","+
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"}";
$.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",   
        data : data, 
        success: function(data) {     
    if(device.manufacturer.toLowerCase()==="apple")
        { 
            myApp.hidePreloader();
        var ref = cordova.InAppBrowser.open("data:application/pdf;base64,"+data.content,'_blank', 'location=no,closebuttoncaption=X,toolbarposition=top');
        }
    else
            {
         managePdfReaderInAndroid(documentName,data.content);
            }
        },
        error: function(e) {
                myApp.hidePreloader();
                myApp.alert("error occured"); 
        }                
    }); 
}
  

function managePdfReaderInAndroid(documentName,base64){
     var folderpath = cordova.file.externalRootDirectory;
   var contentType = "application/pdf";
    savebase64AsPDF(folderpath,documentName+"_"+itemId+".pdf",base64,contentType);
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

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

function savebase64AsPDF(folderpath,filename,content,contentType){
    var DataBlob = b64toBlob(content,contentType);   
  
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
		dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
                 
            }, function(){
                myApp.alert('Unable to save file in path '+ folderpath);
            });
		});
    });
     myApp.hidePreloader();
     window.open(folderpath+"//"+filename,"_system",'location=yes');
}

$$('.edit-mainData-form-to-data').on('click', function(){
    var i;
    var indexToSelect=1;
    var isValid = true;
    var textBox;
    var dateOnly;
    var checkBox;
    var comboBox;
    if(engine==="classicms")
        {
     textBox=$("#my-mainData-form div.requiredItem.textbox input" );
     dateOnly=$("#my-mainData-form div.requiredItem.dateonly input" );
     comboBox=$("#my-mainData-form div.requiredItem.combobox div.item-after" );
     checkBox=$("#my-mainData-form div.requiredItem.checkbox label.label-checkbox");
        }
    else if(engine==="attachment")
        {
     textBox=$("#my-attachment-form div.requiredItem.textbox input" );
     dateOnly=$("#my-attachment-form div.requiredItem.dateonly input" );
     comboBox=$("#my-attachment-form div.requiredItem.combobox div.item-after" );
     checkBox=$("#my-attachment-form div.requiredItem.checkbox label.label-checkbox");
        }
    for (i = 0; i < textBox.length; i++) 
    {

        if($(textBox[i]).val().replace(/\s/g, '')==="")
        {
            $(textBox[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;            
        }
        else
        {
            $(textBox[i]).closest("div.item-inner").removeClass("requiredIcon");
        }
    }
    
    for (i = 0; i < dateOnly.length; i++) 
    {
        if($(dateOnly[i]).val().replace(/\s/g, '')==="")
        {
            $(dateOnly[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(dateOnly[i]).closest("div.item-inner").removeClass("requiredIcon");
        }
    }
   
    for (i = 0; i < comboBox.length; i++)
    {
        if($(comboBox[i]).html().replace(/\s/g, '')==="")
        {
            $(comboBox[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(comboBox[i]).closest("div.item-inner").removeClass("requiredIcon");
        }            
    }  
    
    for (i = 0; i < checkBox.length; i++)
    {
        if($(checkBox[i]).find("input").is(":checked")==false)
        {
            $(checkBox[i]).addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(checkBox[i]).removeClass("requiredIcon");
        }
    }
    if(!isValid)
    {
       $(x[indexToSelect]).next().children().first().focus();
    }
    else
    {
        if(engine==="classicms")
            {
            mainData_SaveEvent();
            }
        else if(engine==="attachment")
            {
            attachement_SaveEvent();
            }
    }
});


function mainData_SaveEvent(){
     var formData = myApp.formToData('#my-mainData-form');
        parameters=JSON.stringify(formData);   
        UpdateItem(parameters);
}

function attachement_SaveEvent(){
    setTimeout( uploadAttachementFile(),1000);
}

function testclick(msg,msgTitle){
    SuccessMsg=msg;
   SuccesMsgTitle= msgTitle;
    var i;
    var indexToSelect=1;
    var isValid = true;
    var textBox=$("#my-relatedItemPopup-form div.requiredItem.textbox input" )
    
    for (i = 0; i < textBox.length; i++) 
    {
        if($(textBox[i]).val().replace(/\s/g, '')==="")
        {
            $(textBox[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;            
        }
        else
        {
            $(textBox[i]).closest("div.item-inner").removeClass("requiredIcon");
        }
    }
    var dateOnly=$("#my-relatedItemPopup-form div.requiredItem.dateonly input" )
    for (i = 0; i < dateOnly.length; i++) 
    {
        if($(dateOnly[i]).val().replace(/\s/g, '')==="")
        {
            $(dateOnly[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(dateOnly[i]).closest("div.item-inner").removeClass("requiredIcon");
        }
    }
    var comboBox=$("#my-relatedItemPopup-form div.requiredItem.combobox div.item-after" )
    for (i = 0; i < comboBox.length; i++)
    {
        if($(comboBox[i]).html().replace(/\s/g, '')==="")
        {
            $(comboBox[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(comboBox[i]).closest("div.item-inner").removeClass("requiredIcon");
        }            
    }  
    var checkBox=$("#my-relatedItemPopup-form div.requiredItem.checkbox label.label-checkbox")
    for (i = 0; i < checkBox.length; i++)
    {
        if($(checkBox[i]).find("input").is(":checked")==false)
        {
            $(checkBox[i]).addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(checkBox[i]).removeClass("requiredIcon");
        }
    }
    if(!isValid)     
    {
       $(x[indexToSelect]).next().children().first().focus();
    }else
    {
        var formData = myApp.formToData('#my-relatedItemPopup-form');
        Parameters=JSON.stringify(formData);        
        setTimeout(function() { UpdateRelatedItemEvent(); }, 1000) ;

       
    }
}

function UpdateRelatedItemEvent(){ 
    var updateId = relatedItemId;    
    if(isDuplicate==="isDuplicate")
        updateId=0;
     var data="{"+  
        "\"mainItemId\":\""+itemId+"\","+
        "\"relatedItemId\":\""+updateId+"\","+
        "\"screenName\":\""+divId+"\","+ 
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"," +
        "\"parameters\":"+Parameters+"}";  
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveRelatedItemEvent';

     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {     
            
            if(data.status==="ok")
                {
                  myApp.closeModal(".popup",true); 
                  myApp.hidePreloader();  
                  manageSaveRelatedItemResponse(data);                         
                }
            else 
                { 
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error");
                }
        },
        error: function(e) {         
             
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader();
            myApp.alert("error occured","Error"); 
      
                             
        }                           
    }); 
}

function UpdateRelatedItem(){ 
    var updateId = relatedItemId;    
    if(isDuplicate==="isDuplicate")
        updateId=0;
     var data="{"+  
        "\"mainItemId\":\""+itemId+"\","+
        "\"relatedItemId\":\""+updateId+"\","+
        "\"screenName\":\""+divId+"\","+ 
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"," +
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," + 
        "\"parameters\":"+Parameters+"}";  
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveRelatedItem';

     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {     
            
            if(data.status==="ok")
                {
                 
                  myApp.hidePreloader();
                        myApp.alert(SuccessMsg, function () {
                        loadScreen(divId);
                        });
                                         
                }
            else 
                { 
                    myApp.hidePreloader();
                    myApp.alert(data.message,data.messageTitle);
                }
        },
        error: function(e) {         
             
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader();
            myApp.alert("error occured","Error"); 
      
                             
        }                           
    }); 
}

function manageSaveRelatedItemResponse(data){
     console.log(data.behavior);
     if(data.behavior!=null)
     {
       
            switch(data.behavior)
                {
                    case "blockingAlert" :
                        {
                            myApp.alert(data.message,"Exception");
                            break;
                        }
                    case "optionalAlert" :
                        {
                              myApp.confirm(data.message, "Exception", function () {
                                        UpdateRelatedItem();
                                         });
                            break;
                        }
                    case "deviationAlert" :
                        {
                             errorMsg=data.message;
                             myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+data.message+'</br></br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveProcessEngineComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveBeforeUpdateRelatedItem_DeviationComment()" id="saveProcessEngineCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
                            break;
                        }
                }
     }
    else
    {
      
              myApp.hidePreloader();
                        myApp.alert(SuccessMsg,SuccesMsgTitle, function () {
                        loadScreen(divId);
                        });
              myApp.closeModal(".popup",true);
    }
}


function saveProcessEngineComment_enabledButton(textarea){
   
    var saveProcessEngineCommentButton=document.getElementById("saveProcessEngineCommentButton");
    if(textarea.value.length!=0)
        {
            saveProcessEngineCommentButton.className ="button button-fill active";
        }
    else
    {
        saveProcessEngineCommentButton.className ="button button-fill disabled";
    }
    
      
};


function saveBeforeUpdateRelatedItem_DeviationComment()
{
    var comment=document.getElementById("deviationComment").value;
    var updateId = relatedItemId;    
    if(isDuplicate==="isDuplicate")
        updateId=0;
    var data="{"+    
        "\"screenName\":\""+divId+"\","+
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"," +
        "\"mainItemId\":\""+itemId+"\","+
        "\"relatedItemId\":\"0\"," +
        "\"comment\":\""+comment+"\"," +
        "\"errorMsg\":\""+errorMsg+"\"," +  
        "\"parameters\":"+Parameters+"}"; 
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveBeforeUpdateRelatedItem_LogDeviation';

     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {     
            
            if(data.status==="ok")
                {
                  myApp.hidePreloader();
                  myApp.closeModal();    
                  myApp.alert(SuccessMsg,SuccesMsgTitle, function () {
                  loadScreen(divId);
                  });                  
                }
            else 
                { 
                    myApp.hidePreloader();
                    myApp.alert(data.message,messageTitle);
                }
        },
        error: function(e) {         
             
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader();
            myApp.alert("error occured"); 
      
                             
        }                           
    }); 
}

function uploadAttachementFile(){
  var formData = myApp.formToData('#my-attachment-form');
        parameters=JSON.stringify(formData);
        myApp.showPreloader();
        var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/AttachFile';
     var data="{"+  
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenName\":\""+divId+"\","+ 
        "\"fileName\":\""+fileUploadedName+"\","+ 
        "\"fileData\":\""+fileUploadedData+"\","+ 
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"," +
        "\"userShortName\":\""+setUser_ShortName(sessionStorage.getItem("userShortName"))+"\"," +
        "\"parameters\":"+parameters+"}";  
  $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {       
            if(data.status==="ok")
                {
                    myApp.hidePreloader();
                    loadScreen(divId);                      
                }
            else 
                { 
                    myApp.hidePreloader();
                    myApp.alert("error saving");
                }
        },
        error: function(e) {         
             
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader(); 
            myApp.alert("error occured");
        }                           
    });   
     
}
function fileDetail(){
    myApp.alert("clic");
}
function UpdateItem(parameters){

      var data="{"+  
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenName\":\""+currentItem+"\","+
        "\"userId\":\""+sessionStorage.getItem("userId")+"\"," +
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/UpdateItem';

     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {     
            myApp.hidePreloader();
            myApp.alert(data.message);
        },
        error: function(e) { 
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader();
            myApp.alert("error occured");
   
                             
        }                               
    });    
} 
function downloadAsset(fileName) {
  var assetURL = "https://raw.githubusercontent.com/cfjedimaster/Cordova-Examples/master/readme.md";  
  var  store = cordova.file.dataDirectory;
    var fileTransfer = new FileTransfer();
    fileTransfer.download(assetURL, store + fileName, 
        function(entry) {
            console.log("Success!");  
        }, 
        function(err) {
            console.log("Error");
        });
}  

    
  




 