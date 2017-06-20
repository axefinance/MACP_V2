var loading = false;
var infiniteScroll_JSFlag; 
var lastIndex = 30;
var itemsPerLoad = 10;
var transactionAmountStringList=null;
var transactionAmountFeesListObject=null;
var transactionAmountEventFeesListObject=null;
var PricingConditionEdiatbelegrids = {};



function simulateEvent(){
  var isValidForm = requiredFormComponent("#my-relatedItemPopup-form");  
  var stringify= getGridonPoponsData("#my-relatedItemPopup-form");
    if(isValidForm)
  GetAmortizationPopon(stringify);
}
function GetAmortizationPopon(stringify){
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
       "\"mainItemId\":\""+itemId+"\"," + 
       "\"screenTag\":\""+divId+"\"," +   
       "\"parentId\":\""+itemId+"\"," +  
       "\"screenName\":\""+currentItem+"\","+
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
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });         
}



function savePricingCondition(){
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
       "\"mainItemId\":\""+itemId+"\"," + 
       "\"screenTag\":\""+divId+"\"," +   
       "\"parentId\":\""+itemId+"\"," +    
       "\"relatedItemId\":\""+relatedItemId+"\"," +  
       "\"remoteIp\":\""+sessionStorage.getItem('Ip_config')+"\"," + 
       "\"transactionAmountStringList\":\""+transactionAmountStringList+"\"," +      
       "\"transactionAmountFeesListObject\":"+transactionAmountFeesListObject+"," +   
       "\"transactionAmountEventFeesListObject\":"+transactionAmountEventFeesListObject+"," + 
       "\"screenName\":\""+currentItem+"\","+ 
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
             loadScreen(divId);
             mainView.router.back({reloadPrevious:true});
        
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });
    }
}

function savePricingConditionEvent(){
    
    var isValidForm = requiredFormComponent("my-relatedItemPopup-form"); 
    if(isValidForm)
    {
     myApp.showPreloader();
     var stringify= getGridonPoponsData("#my-relatedItemPopup-form");    
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveConditionEvent';
     var formData = myApp.formToData('#my-relatedItemPopup-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"mainItemId\":\""+itemId+"\"," + 
       "\"screenTag\":\""+divId+"\"," +   
       "\"parentId\":\""+itemId+"\"," +    
       "\"relatedItemId\":\""+relatedItemId+"\"," +  
       "\"remoteIp\":\""+sessionStorage.getItem('Ip_config')+"\"," + 
       "\"transactionAmountStringList\":\""+transactionAmountStringList+"\"," +      
       "\"transactionAmountFeesListObject\":"+transactionAmountFeesListObject+"," +   
       "\"transactionAmountEventFeesListObject\":"+transactionAmountEventFeesListObject+"," + 
       "\"screenName\":\""+currentItem+"\","+
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
            manageSaveConditionResponse(data);
        
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

function manageSaveConditionResponse(data) {
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
                                savePricingCondition();
                            });
                            break;
                        }
                    case "deviationAlert":
                        {
                            errorMsg = data.message;
                            myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">' + data.message + '</br></br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveProcessEngineComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveBeforeSaveConditon_DeviationComment()" id="saveProcessEngineCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
                            break;
                        }
                }
            }
            else
            {
                
            loadScreen(divId);
            mainView.router.back({reloadPrevious:true});
            }
}

function saveBeforeSaveConditon_DeviationComment(){
    var comment = document.getElementById("deviationComment").value;
    var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveCustomErrorHandlingDeviationCommentAndSaveCondition';
     var formData = myApp.formToData('#my-relatedItemPopup-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"mainItemId\":\""+itemId+"\"," + 
       "\"screenTag\":\""+divId+"\"," +   
       "\"parentId\":\""+itemId+"\"," +    
       "\"comment\":\""+comment+"\"," +
       "\"errMsg\":\""+errorMsg+"\"," +  
       "\"relatedItemId\":\""+relatedItemId+"\"," +  
       "\"remoteIp\":\""+sessionStorage.getItem('Ip_config')+"\"," + 
       "\"transactionAmountStringList\":\""+transactionAmountStringList+"\"," +      
       "\"transactionAmountFeesListObject\":"+transactionAmountFeesListObject+"," +   
       "\"transactionAmountEventFeesListObject\":"+transactionAmountEventFeesListObject+"," + 
       "\"screenName\":\""+currentItem+"\","+ 
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
            loadScreen(divId);
            mainView.router.back({reloadPrevious:true});
        
        },
        error: function(e) {
            myApp.hidePreloader();    
            myApp.alert("error occured","Error");      
        }   
    });       
}

