var qi_transactionAmountStringList=null;
var qi_transactionAmountFeesListObject=null;
var qi_transactionAmountEventFeesListObject=null;
function saveQIExistingPoponButtonEvent(){
    var isValidForm = requiredFormComponent("#my-existingItemQIPopon-form"); 
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-existingItemQIPopon-form');
        parameters=JSON.stringify(formData);
        saveExistingQIPoponEvent(parameters);
    }
}

function saveExistingQIPoponEvent(parameters){       
     var data="{"+    
        "\"screenWidth\":\""+window.innerWidth+"\","+
        "\"subItem\":\""+gSubItem.toLowerCase()+"\","+
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
                   mainView.router.load({url: "existingQuickInputScreen.html",reload:true});                                      
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

function saveQIExistingButtonEvent(transactionId, counterpartyId, creditFileId){
        var isValidForm = requiredFormComponent("#my-existingItemQI-form"); 
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-existingItemQI-form');
        parameters=JSON.stringify(formData);
        saveExistingQIEvent(parameters, transactionId, counterpartyId, creditFileId);
    }    
}
function saveExistingQIEvent(parmeters,transactionId, counterpartyId, creditFileId){
      var stringify= getGridonPoponsData("#my-existingItemQI-form");
         var data="{"+    
        "\"subItem\":\""+gSubItem.toLowerCase()+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+transactionId+"\"," +  
        "\"counterpartyId\":\""+counterpartyId+"\"," +  
        "\"creditFileId\":\""+creditFileId+"\"," +  
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
            if(data.status ==="true")
                {
                    $(".startWF-From-ExistingQI-Screen-form-to-data").removeClass("disabledButton")
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
function simalteInQIScreenEvent(screenName)
{
    var isValidForm = requiredFormComponent("#my-existingItemQI-form");  
  var stringify= getGridonPoponsData("#my-existingItemQI-form");
    if(isValidForm)
  GetQIAmortizationPopon(stringify,screenName);
}

function GetQIAmortizationPopon(stringify,item){
     myApp.showPreloader();
     var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetAmortizationGrid';
     var popupWidth=window.innerWidth*0.90;
     var popupHeight=window.innerHeight*0.90;
     popupWidth=Math.floor(popupWidth); 
     popupHeight=Math.floor(popupHeight); 
     var formData = myApp.formToData('#my-existingItemQI-form');
     var parameters=JSON.stringify(formData);
     var data="{"+ 
       "\"limit\":\"30\","+
       "\"start\":\"0\","+ 
       "\"mainItemId\":\""+gQITransactionId+"\"," + 
       "\"screenTag\":\""+item+"\"," +   
       "\"parentId\":\""+gQITransactionId+"\"," +  
       "\"screenName\":\""+item+"\","+
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