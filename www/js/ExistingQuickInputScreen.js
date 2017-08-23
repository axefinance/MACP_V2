
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
        "\"transactionAmountListObj\":"+null+"," +  
        "\"transactionAmountFeesObjects\":"+null+"," +  
        "\"transactionAmountEventFeesObject\":"+null+"," +  
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
         var data="{"+    
        "\"subItem\":\""+gSubItem.toLowerCase()+"\","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionId\":\""+transactionId+"\"," +  
        "\"counterpartyId\":\""+counterpartyId+"\"," +  
        "\"creditFileId\":\""+creditFileId+"\"," +  
        "\"transactionShotrname\":\"0\"," +  
        "\"transactionConditionId\":\""+gTransactionConditionId+"\"," +  
        "\"transactionAmountListObj\":"+null+"," +  
        "\"transactionAmountFeesObjects\":"+null+"," +  
        "\"transactionAmountEventFeesObjects\":"+null+"," +  
        "\"transactionConditionTemplate\":"+null+"," +  
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
                $(".startWF-From-ExistingQI-Screen-form-to-data").removeClass("disabledButton")
                gTransactionConditionId = data.transactionConditionId;
            myApp.hidePreloader();

        },
        error: function(e) { 
             
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);
     }                           
    }); 
}