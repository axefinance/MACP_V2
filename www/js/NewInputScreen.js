var NewInputScreen_JSFlag;
var errorMsg;

$$('.newInput-form-to-data').on('click', function(){
    var formId = "form"; 
    var isValidForm = requiredFormComponent(formId); 
   /* if(!isValid)
    {
       $(x[indexToSelect]).next().children().first().focus();
    }else*/
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-newInput-form');
        parameters=JSON.stringify(formData);
        saveNewInputEvent(parameters);
    }
});


function saveNewInputEvent(parameters){
      var data="{"+    
        "\"screenName\":\""+gSubItem+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveNewInputEvent";
     $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,             
        success: function(data) {     
            myApp.hidePreloader();
            if(data.status==="ok")
            {
                   manageSaveInputResponse(data);
            }
            else  
            {
                   myApp.alert(data.message,data.message);
            }
        },
        error: function(e) { 
            console.log(e.message);  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage();
     }                           
    });    
}


function saveNewInput(parameters){
    
      var data="{"+    
        "\"screenName\":\""+gSubItem+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," + 
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveNewInput";
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
            itemId=data.itemId; 
            divId=data.itemId;
            itemRef=data.itemRef; 
            TargetTab=data.targetTab;  
            if(!checkInternetConnection())                                                   
                myApp.alert("please check your internet connection");
            else         
                mainView.router.load({url: "editScreen.html",reload:true});
            fromNewInput=true;
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
            errorMessage();

                                 
        }                           
    });    
}


function manageSaveInputResponse(data)
{
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
                                        var formData = myApp.formToData('#my-newInput-form');
                                        parameters=JSON.stringify(formData);
                                        saveNewInput(parameters);
                                         });
                            break;
                        }
                    case "deviationAlert" :
                        {
                             errorMsg=data.message;
                             myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+data.message+'</br></br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveProcessEngineComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveBeforeInsert_DeviationComment()" id="saveProcessEngineCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
                            break;
                        }
                }
    }
    else
        {
            itemId=data.itemId; 
            itemRef=data.itemRef;
            TargetTab=data.targetTab;
            if(!checkInternetConnection())                                                   
                myApp.alert("please check your internet connection");
            else 
                mainView.router.load({url: "editScreen.html",reload:true});
            fromNewInput=true;
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

function saveBeforeInsert_DeviationComment()
{
     var comment=document.getElementById("deviationComment").value; 
     var formData = myApp.formToData('#my-newInput-form');
      var  parameters=JSON.stringify(formData);
       myApp.closeModal(); 
      var data="{"+    
        "\"screenName\":\""+gSubItem+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\"0\"," +
        "\"relatedItemId\":\"0\"," +
        "\"comment\":\""+comment+"\"," +
        "\"errorMsg\":\""+errorMsg+"\"," +  
        "\"parameters\":"+parameters+"}";  
     myApp.showPreloader();
     var url="http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/SaveBeforeInsert_LogDeviation";
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
            itemId=data.itemId; 
            divId=data.itemId;
            itemRef=data.itemRef;              
            TargetTab=data.targetTab; 
            if(!checkInternetConnection())                                                   
                myApp.alert("please check your internet connection");
            else 
                mainView.router.load({url: "editScreen.html",reload:true});
            fromNewInput=true;
        }
    else{  
            myApp.hidePreloader();
                    myApp.alert(data.message,data.messageTitle);    
        }
        },
        error: function(e) { 
            console.log(e.message);  
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage();

                                 
        }                           
    }); 
}

