var qi_transactionAmountStringList=null;
var qi_transactionAmountFeesListObject=null;
var qi_transactionAmountEventFeesListObject=null;
var TransactionId;
var CounterpartyId;
var CreditFileId;
var DeviationComment;
var ErrorMsg;
function saveQIExistingPoponButtonEvent(){
    var isValidForm = requiredFormComponent("#my-QIPopon-form"); 
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-QIPopon-form');
        parameters=JSON.stringify(formData);
        saveQIPoponEvent(parameters);
    }
}

function saveQIPoponEvent(parameters){      
     var data="{"+    
        "\"screenWidth\":\""+window.innerWidth+"\","+
        "\"subItem\":\""+gSubItem.toLowerCase()+"\","+
        "\"sourceTag\":\""+gSourceTag+"\","+ 
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionID\":\"\"," +  
        "\"counterpartyID\":\"\"," +  
        "\"creditFileID\":\"\"," +  
        "\"tabTitle\":\"\"," +  
        "\"transactionAmountListObj\":"+qi_transactionAmountStringList+"," +  
        "\"transactionAmountFeesObjects\":"+qi_transactionAmountFeesListObject+"," +  
        "\"transactionAmountEventFeesObject\":"+qi_transactionAmountEventFeesListObject+"," +  
        "\"transactionConditionTemplate\":"+null+"," +  
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveNewQuickInput";
     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,             
        success: function(data) {  
            
            if(data.verifSave===true)
                {
                   gQITransactionId=data.transactionID;
                   gQICounterpartyId=data.counterpartyID;
                   gQICreditFIldId=data.creditFileID;
                   gTransactionTypeId=data.transactionTypeId;    
                   gScreenName="existing"+gSubItem.toLowerCase()+"_quickinput";    
                   gSubItem=data.subItem; 
                   gMainItemId=gQITransactionId;    
                   mainView.router.load({url: "quickInputDetailsScreen.html",reload:true});                                      
                }
            else 
                {  
                     errorMessage(data.errorMessage);
                } 
        },
        error: function(e) {  
            
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    });  
}

function saveQIExistingButtonEvent(transactionId, counterpartyId, creditFileId,screenName){
     TransactionId=transactionId;
     CounterpartyId=counterpartyId;
     CreditFileId=creditFileId;
        var isValidForm = requiredFormComponent("#my-existingItemQI-form"); 
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-existingItemQI-form');
        var  parameters=JSON.stringify(formData);
        saveExistingQIEvent(parameters,screenName);
    }    
}
function saveExistingQIEvent(parameters,screenName){
      var stringify= getGridonPoponsData("#my-existingItemQI-form");
         var data="{"+    
        "\"screenName\":\""+screenName+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+TransactionId+"\"," +  
        "\"counterpartyId\":\""+CounterpartyId+"\"," +  
        "\"creditFileId\":\""+CreditFileId+"\"," +  
        "\"transactionShotrname\":\"0\"," +  
        "\"transactionConditionId\":\""+gTransactionConditionId+"\"," +  
        "\"transactionAmountListObj\":"+qi_transactionAmountStringList+"," +  
        "\"transactionAmountFeesObjects\":"+qi_transactionAmountFeesListObject+"," +  
        "\"transactionAmountEventFeesObject\":"+qi_transactionAmountEventFeesListObject+"," +  
        "\"transactionConditionTemplate\":"+null+"," +  
        "\"stringify\":"+stringify+"," +     
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveDetailsQuickinputEvent";
     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,             
        success: function(data) {    
            if(data.status ==="ok")
                {
                    myApp.hidePreloader();
                    manageSaveQIDetailsResponse(data,data.transactionConditionId,screenName);
                }
            else
                {
                    myApp.hidePreloader();
                   errorMessage(data.errorMessage);
                }
        },
        error: function(e) {  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    }); 
}

function saveExistingQI(screenName){
      var stringify= getGridonPoponsData("#my-existingItemQI-form");
       var formData = myApp.formToData('#my-existingItemQI-form');
      var  parameters=JSON.stringify(formData);
         var data="{"+    
        "\"screenName\":\""+screenName+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+TransactionId+"\"," +  
        "\"counterpartyId\":\""+CounterpartyId+"\"," +  
        "\"creditFileId\":\""+CreditFileId+"\"," +  
        "\"transactionShotrname\":\"0\"," +  
        "\"transactionConditionId\":\""+gTransactionConditionId+"\"," +  
        "\"transactionAmountListObj\":"+qi_transactionAmountStringList+"," +  
        "\"transactionAmountFeesObjects\":"+qi_transactionAmountFeesListObject+"," +  
        "\"transactionAmountEventFeesObject\":"+qi_transactionAmountEventFeesListObject+"," +  
        "\"transactionConditionTemplate\":"+null+"," +  
        "\"stringify\":"+stringify+"," +     
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveDetailsQuickinput";
     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,             
        success: function(data) {    
            if(data.status ==="ok")
                {
                    myApp.hidePreloader();
                    $(".startWF-From-Edit-Screen-form-to-data").removeClass("disabledButton");
                    $(".startWF-From-Edit-Screen-form-to-data").removeAttr("disabled");
                    gTransactionConditionId = data.transactionConditionId;
                    myApp.hidePreloader(); 
                    myApp.alert(data.successMessage);
                }
            else
                {
                    myApp.hidePreloader();
                   errorMessage(data.errorMessage);
                }
        },
        error: function(e) {  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    }); 
} 
function simalteInQIScreenEvent(screenName){
    var isValidForm = requiredFormComponent("#my-existingItemQI-form");  
  var stringify= getGridonPoponsData("#my-existingItemQI-form");
    if(isValidForm)
  GetQIAmortizationPopon(stringify,screenName);
}

function GetQIAmortizationPopon(stringify,screenName){
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetAmortizationGrid';
     var popupWidth=window.innerWidth*0.90;
     var popupHeight=window.innerHeight*0.90;
     popupWidth=Math.floor(popupWidth); 
     popupHeight=Math.floor(popupHeight); 
     gScreenName=screenName;
     var formData = myApp.formToData('#my-existingItemQI-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"limit\":\"30\","+
       "\"start\":\"0\","+ 
       "\"mainItemId\":\""+gQITransactionId+"\"," + 
       "\"screenTag\":\""+screenName+"\"," +   
       "\"parentId\":\""+gQITransactionId+"\"," +  
       "\"screenName\":\""+screenName+"\","+
       "\"userData\":"+sessionStorage.getItem("userData")+","+ 
       "\"poponWidth\":\""+popupWidth+"\"," + 
       "\"poponHeight\":\""+popupHeight+"\"," +  
       "\"stringify\":"+stringify+"," +  
       "\"parameters\":"+parameters+"}" ;  
    $.ajax({ 
        type: "POST",  
        dataType:"json",    
        url: url,    
        contentType: "text/plain",                           
        dataType: "json",                         
        data: data,        
        success: function(data) { 
            myApp.hidePreloader();
             transactionAmountStringList=data.transactionAmountStringList;
             transactionAmountFeesListObject=data.transactionAmountFeesListObject;
             transactionAmountEventFeesListObject=data.transactionAmountEventFeesListObject;
             myApp.popup('<div class="popup" style="overflow:hidden !important; width: 90% !important; top: 5% !important;left: 5% !important; margin-left: 0px !important;height:90% !important; margin-top: 0px !important; position:absoloute !important; padding-left:5px !important; padding-right:5px !important ;padding-top:7px !important; padding-bottom:7px !important"  >'+data.content+'</div>', true);
             myApp.attachInfiniteScroll($$('.amortization-infinite-scroll'));
            loadJSFile("js/amortizationInfiniteScroll.js");
            gAmortizationParameters=parameters;
            gAmortizationStringiFyData=stringify;
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });         
}
function manageSaveQIDetailsResponse(data,parentItemId,screenName) {
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
                                saveExistingQI(screenName);
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                            ErrorMsg = data.message;
                            ErrorMsg=escapeNewLineChars(ErrorMsg);
                            myApp.popup("<div class='popup' style='width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;' ><div class='content-block-title' style='word-wrap: break-word !important;white-space : inherit !important;'>" + data.message + "</br></br></div><div class='list-block' ><ul><li class='align-top'><div class='item-content'><div class='item-media'></div><div class='item-inner'><div class='item-input'><textarea id='QIdeviationComment' onkeyup='saveQIDetailsComment_enabledButton(this)'></textarea></div></div></div></li></ul></<div><br><br><div class='row'><div class='col-50'><a href='#' class='button button-fill disabled' onclick='SaveQIDetails_LogDeviation(\""+screenName+"\",\"false\")' id='saveQIDetailsCommentButton'>Yes</a></div><div class='col-50'><a href='#' class='button button-fill active' onclick='myApp.closeModal()'>No</a></div></div></div>", true);
                            break;
                                                                  
             
                                        
                        }
                }
            }
            else {

                myApp.hidePreloader();
                 $(".startWF-From-Edit-Screen-form-to-data").removeClass("disabledButton");
                 $(".startWF-From-Edit-Screen-form-to-data").removeAttr("disabled");
                    gTransactionConditionId = data.transactionConditionId;
                     myApp.hidePreloader();
                    myApp.alert(data.successMessage);
            } 
     }
function escapeNewLineChars(valueToEscape) {
    if (valueToEscape != null && valueToEscape != "") {
        return valueToEscape.replace(/\n/g, "\\n");
    } else {
        return valueToEscape;
    }
}
function SaveQIDetails_LogDeviation(screenName,isRunningWF){
    myApp.closeModal();
    DeviationComment = document.getElementById("QIdeviationComment").value;
    var stringify= getGridonPoponsData("#my-existingItemQI-form");
    var popupWidth=window.innerWidth*0.90;
        var popupHeight=window.innerHeight*0.90;
        popupWidth=Math.floor(popupWidth); 
        popupHeight=Math.floor(popupHeight); 
    var formData = myApp.formToData('#my-existingItemQI-form');
    var parameters=JSON.stringify(formData);
         var data="{"+    
        "\"screenName\":\""+screenName+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+TransactionId+"\"," +  
        "\"counterpartyId\":\""+CounterpartyId+"\"," +  
        "\"creditFileId\":\""+CreditFileId+"\"," + 
        "\"poponWidth\":\""+popupWidth+"\"," + 
        "\"subItem\":\""+gSubItem+"\"," +        
        "\"poponHeight\":\""+popupHeight+"\"," +
        "\"transactionShotrname\":\"0\"," +  
        "\"transactionConditionId\":\""+gTransactionConditionId+"\"," +  
        "\"transactionAmountListObj\":"+qi_transactionAmountStringList+"," +  
        "\"transactionAmountFeesObjects\":"+qi_transactionAmountFeesListObject+"," +  
        "\"transactionAmountEventFeesObject\":"+qi_transactionAmountEventFeesListObject+"," +  
        "\"transactionConditionTemplate\":"+null+"," + 
        "\"runningWF\":"+isRunningWF+"," +      
        "\"stringify\":"+stringify+"," +
        "\"deviationComment\":\""+DeviationComment+"\"," +
        "\"errorMsg\":\""+ErrorMsg+"\"," +     
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveQIDetails_LogDeviation";
     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,              
        success: function(data) { 
            
            if(data.status ==="ok")
                {  
                    myApp.hidePreloader();
                    if(isRunningWF==='false')
                        {
                    $(".startWF-From-Edit-Screen-form-to-data").removeClass("disabledButton");
                    $(".startWF-From-Edit-Screen-form-to-data").removeAttr("disabled");
                    gTransactionConditionId = data.transactionConditionId;
                    myApp.hidePreloader();
                    myApp.closeModal();
                    myApp.alert(data.successMessage);
                        }
                    
                    else
                        manageStartWorkFlowResponse(data,TransactionId);
                }
            else
                {
                    myApp.hidePreloader();
                   errorMessage(data.errorMessage);
                }
        },
        error: function(e) {  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    }); 
}

function saveQIDetailsComment_enabledButton(textarea) {

            var saveProcessEngineCommentButton = document.getElementById("saveQIDetailsCommentButton");
            if (textarea.value.length != 0) {
                saveProcessEngineCommentButton.className = "button button-fill active";
            }
            else {
                saveProcessEngineCommentButton.className = "button button-fill disabled";
            }
        };

function startQIworkflowButtonAction(mainItemId,screenName)
{
      var isValidForm = requiredFormComponent("#my-existingItemQI-form"); 
    if(isValidForm)
     { 
        var formData = myApp.formToData('#my-existingItemQI-form');
        var  parameters=JSON.stringify(formData);
        var stringify= getGridonPoponsData("#my-existingItemQI-form");
        var popupWidth=window.innerWidth * 0.80;
        var popupHeight= 95;
        popupWidth=Math.floor(popupWidth); 
        popupHeight=Math.floor(popupHeight); 
        myApp.showPreloader(); 
         var data="{"+    
        "\"screenName\":\""+screenName+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+TransactionId+"\"," +  
        "\"counterpartyId\":\""+CounterpartyId+"\"," + 
        "\"subItem\":\""+gSubItem+"\"," +     
        "\"creditFileId\":\""+CreditFileId+"\"," + 
        "\"poponWidth\":\""+popupWidth+"\"," + 
        "\"poponHeight\":\""+popupHeight+"\"," +     
        "\"transactionShotrname\":\"0\"," +  
        "\"transactionConditionId\":\""+gTransactionConditionId+"\"," +  
        "\"transactionAmountListObj\":"+qi_transactionAmountStringList+"," +  
        "\"transactionAmountFeesObjects\":"+qi_transactionAmountFeesListObject+"," +  
        "\"transactionAmountEventFeesObject\":"+qi_transactionAmountEventFeesListObject+"," +  
        "\"transactionConditionTemplate\":"+null+"," +  
        "\"stringify\":"+stringify+"," +     
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"parameters\":"+parameters+"}";
        var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/StartQIWorkFlowButtonAction";
        $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,              
        success: function(data) { 
            
            if(data.status ==="ok")
                {
                   manageStartQIWorkflowResponse(data,screenName);
                }
            else
                {
                    myApp.hidePreloader();
                   errorMessage(data.errorMessage);
                }
        },
        error: function(e) {  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    });  

     }    
    
}

function manageStartQIWorkflowResponse(data,screenName)
{
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
                                SaveQIDetailsAndStartWorkflow(screenName);
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                            ErrorMsg = data.message;
                            ErrorMsg=escapeNewLineChars(ErrorMsg);
                            myApp.popup("<div class='popup' style='width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;' ><div class='content-block-title' style='word-wrap: break-word !important;white-space : inherit !important;'>" + data.message + "</br></br></div><div class='list-block' ><ul><li class='align-top'><div class='item-content'><div class='item-media'></div><div class='item-inner'><div class='item-input'><textarea id='QIdeviationComment' onkeyup='saveQIDetailsComment_enabledButton(this)'></textarea></div></div></div></li></ul></<div><br><br><div class='row'><div class='col-50'><a href='#' class='button button-fill disabled' onclick='SaveQIDetails_LogDeviation(\""+screenName+"\",\"true\")' id='saveQIDetailsCommentButton'>Yes</a></div><div class='col-50'><a href='#' class='button button-fill active' onclick='myApp.closeModal()'>No</a></div></div></div>", true);
                            break;
                                                                  
             
                                        
                        }
                }
            }
            else  {

                manageStartWorkFlowResponse(data,TransactionId);
            }
}

function SaveQIDetailsAndStartWorkflow(screenName)
{
        var formData = myApp.formToData('#my-existingItemQI-form');
        var  parameters=JSON.stringify(formData);
        var stringify= getGridonPoponsData("#my-existingItemQI-form");
        var popupWidth=window.innerWidth*0.90;
        var popupHeight=window.innerHeight*0.90;
        popupWidth=Math.floor(popupWidth); 
        popupHeight=Math.floor(popupHeight); 
        myApp.showPreloader();
       var data="{"+    
        "\"screenName\":\""+screenName+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+TransactionId+"\"," +  
        "\"counterpartyId\":\""+CounterpartyId+"\"," + 
        "\"subItem\":\""+gSubItem+"\"," +     
        "\"creditFileId\":\""+CreditFileId+"\"," + 
        "\"poponWidth\":\""+popupWidth+"\"," + 
        "\"poponHeight\":\""+popupHeight+"\"," +     
        "\"transactionShotrname\":\"0\"," +  
        "\"transactionConditionId\":\""+gTransactionConditionId+"\"," +  
        "\"transactionAmountListObj\":"+qi_transactionAmountStringList+"," +  
        "\"transactionAmountFeesObjects\":"+qi_transactionAmountFeesListObject+"," +  
        "\"transactionAmountEventFeesObject\":"+qi_transactionAmountEventFeesListObject+"," +  
        "\"transactionConditionTemplate\":"+null+"," +  
        "\"stringify\":"+stringify+"," +     
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"parameters\":"+parameters+"}";
    var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveQIDetailsAndStartWorkflow";
    
     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,              
        success: function(data) { 
            
            if(data.status ==="ok")
                {   
                    myApp.hidePreloader();
                    manageStartWorkFlowResponse(data,TransactionId);
                }
            else
                {
                    myApp.hidePreloader();
                   errorMessage(data.errorMessage);
                }
        },
        error: function(e) {  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    }); 
    
}