var loading = false;
var infiniteScroll_JSFlag; 
var lastIndex = 30;
var itemsPerLoad = 10;
var transactionAmountStringList=null;
var transactionAmountFeesListObject=null;
var transactionAmountEventFeesListObject=null;
var mainItemIdForPricingConditionScreen;
var mainItemForPricingConditionScreen;


function simulateEvent(item,mainItemId){
  var isValidForm = requiredFormComponent("#my-relatedItemPopup-form");  
  var stringify= getGridonPoponsData("#my-relatedItemPopup-form");
    if(isValidForm)
  GetAmortizationPopon(stringify,item,mainItemId);
}
function GetAmortizationPopon(stringify,screenName,mainItemId){
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetAmortizationGrid';
     var popupWidth=window.innerWidth*0.90;
     var popupHeight=window.innerHeight*0.90;
     popupWidth=Math.floor(popupWidth); 
     popupHeight=Math.floor(popupHeight); 
     var formData = myApp.formToData('#my-relatedItemPopup-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"limit\":\"30\","+
       "\"start\":\"0\","+ 
       "\"mainItemId\":\""+mainItemId+"\"," +   
       "\"parentId\":\""+mainItemId+"\"," +  
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
             createPopup(data.content,"","5%","5%","90%","90%");
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



function savePricingCondition(screenName){
    var isValidForm = requiredFormComponent("#my-relatedItemPopup-form"); 
    if(isValidForm)
    {
   myApp.showPreloader();
         var stringify= getGridonPoponsData("#my-relatedItemPopup-form");
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveCondition';
     var popupWidth=window.innerWidth*0.90;
     var popupHeight=window.innerHeight*0.90;
     popupWidth=Math.floor(popupWidth); 
     popupHeight=Math.floor(popupHeight); 
     var formData = myApp.formToData('#my-relatedItemPopup-form');   
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"mainItemId\":\""+mainItemIdForPricingConditionScreen+"\"," + 
       "\"screenTag\":\""+screenName+"\"," +   
       "\"parentId\":\""+mainItemIdForPricingConditionScreen+"\"," +    
       "\"relatedItemId\":\""+relatedItemId+"\"," +  
       "\"remoteIp\":\""+sessionStorage.getItem('Ip_config')+"\"," + 
       "\"transactionAmountStringList\":\""+transactionAmountStringList+"\"," +      
       "\"transactionAmountFeesListObject\":"+transactionAmountFeesListObject+"," +   
       "\"transactionAmountEventFeesListObject\":"+transactionAmountEventFeesListObject+"," + 
       "\"screenName\":\""+screenName+"\","+ 
       "\"stringify\":"+stringify+"," +     
       "\"userData\":"+sessionStorage.getItem("userData")+","+ 
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
             loadScreen(screenName,mainItemIdForPricingConditionScreen,mainItemForPricingConditionScreen,"classicre");
             mainView.router.back({reloadPrevious:true});
        
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });
    }
}

function savePricingConditionEvent(mainItemId,screenName,relatedItemId){
    
    var isValidForm = requiredFormComponent("my-relatedItemPopup-form"); 
    if(isValidForm)
    {
     myApp.showPreloader();
     var stringify= getGridonPoponsData("#my-relatedItemPopup-form");    
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveConditionEvent';
     var formData = myApp.formToData('#my-relatedItemPopup-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"mainItemId\":\""+mainItemId+"\"," + 
       "\"screenTag\":\""+screenName+"\"," +        
       "\"relatedItemId\":\""+relatedItemId+"\"," +  
       "\"remoteIp\":\""+sessionStorage.getItem('Ip_config')+"\"," + 
       "\"transactionAmountStringList\":\""+transactionAmountStringList+"\"," +      
       "\"transactionAmountFeesListObject\":"+transactionAmountFeesListObject+"," +   
       "\"transactionAmountEventFeesListObject\":"+transactionAmountEventFeesListObject+"," + 
       "\"screenName\":\""+screenName+"\","+
       "\"stringify\":"+stringify+"," +       
       "\"userData\":"+sessionStorage.getItem("userData")+","+ 
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
            manageSaveConditionResponse(data,item,screenName);
        
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });  
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

function manageSaveConditionResponse(data,item,screenName) {
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
                                savePricingCondition(screenName);
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                            errorMsg = data.message;
                            generateSaveCommentDeviationPopup(data.message,saveEventHandler);
                            break;
                        }
                }
            }
            else
            {
                
           myApp.alert(data.successMsg,"MACP", function () { loadScreen(screenName,gMainItemId,item,"classicre");
            mainView.router.back({reloadPrevious:true});
                                                           });
            }
}

function saveBeforeSaveConditon_DeviationComment(screenName){
    var comment = document.getElementById("deviationComment").value;
    var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveCustomErrorHandlingDeviationCommentAndSaveCondition';
     var formData = myApp.formToData('#my-relatedItemPopup-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"mainItemId\":\""+mainItemIdForPricingConditionScreen+"\"," + 
       "\"screenTag\":\""+screenName+"\"," +   
       "\"parentId\":\""+itemId+"\"," +    
       "\"comment\":\""+comment+"\"," +
       "\"errMsg\":\""+errorMsg+"\"," +  
       "\"relatedItemId\":\""+relatedItemId+"\"," +  
       "\"remoteIp\":\""+sessionStorage.getItem('Ip_config')+"\"," + 
       "\"transactionAmountStringList\":\""+transactionAmountStringList+"\"," +      
       "\"transactionAmountFeesListObject\":"+transactionAmountFeesListObject+"," +   
       "\"transactionAmountEventFeesListObject\":"+transactionAmountEventFeesListObject+"," + 
       "\"screenName\":\""+screenName+"\","+ 
       "\"userData\":"+sessionStorage.getItem("userData")+","+ 
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
            myApp.closeModal();
            loadScreen(screenName,mainItemIdForPricingConditionScreen,mainItemForPricingConditionScreen,"classicre");
            mainView.router.back({reloadPrevious:true});
        
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });       
}

