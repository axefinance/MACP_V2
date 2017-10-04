var eligibilityObject;
var deviatedMsg;
var withValidatorControl;
var requiredDocument;
function stopWorkflow(mainItemId){
   var comment=document.getElementById("stopWorkflowComment").value; 
   myApp.closeModal();
   myApp.showPreloader();
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/StopWorkflow';
    var data="{"+       
        "\"taskId\":\""+gTaskId+"\"," +
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+mainItemId+"\"," +    
        "\"comment\":\""+comment+"\"," +
       "\"workflowName\":\""+gExecutedWorkflowName+"\"}";
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
                    gExtendedProperties=null;
                    gHomeBackButton.style.visibility="hidden";   
                    mainView.router.back({force:true,pageName:"homePage"});
                    mainView.history=["#homePage"];
                    if(!checkInternetConnection())                                                   
                        myApp.alert("please check your internet connection");
                    else 
                        leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                }
            else                     
                { 
                    myApp.hidePreloader();
                }
        },
        error: function(e) {         
             
            verifconnexion = false;        
            myApp.hidePreloader();                   
            errorMessage(e.message);

        }                             
    });     
}
function stopWorkflowEvent(mainItemId)
{
     showcommentPopup(mainItemId);
}
function enabledButton(textarea){
   
    var stopWorkflowButton=document.getElementById("stopWfYesButton");
    if(textarea.value.length!=0)
        {
            stopWorkflowButton.className ="button button-fill active";
        }
    else
    {
        stopWorkflowButton.className ="button button-fill disabled";
    }   
}; 
function saveDeviationComment_enabledButton(textarea){
   
    var stopWorkflowButton=document.getElementById("saveDeviationCommentButton");
    if(textarea.value.length!=0)
        {
            stopWorkflowButton.className ="button button-fill active";
        }
    else
    {
        stopWorkflowButton.className ="button button-fill disabled";
    }
}; 
function endTaskButtonEvent(mainItemId)
{
        var formId = "#my-mainData-form__"+mainItemId;
        var isValidForm = requiredFormComponent(formId); 
        if(isValidForm){
             endTaskEvent(formId,mainItemId);
        }
}
function showcommentPopup(mainItemId){
    var popupContent='<div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+gStopWFMessage+'</br></br><br><br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="stopWorkflowComment" onkeyup="enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="stopWorkflow(\''+mainItemId+'\')" id="stopWfYesButton" style="width:50%; margin-left:50%">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()" style="width:50%;">No</a></div></div>';
    createPopup(popupContent,"","30%","30%","40%","40%");
}  
function endTaskEvent(formId,mainItemId){
   myApp.showPreloader();
      var formData = myApp.formToData(formId);
     var   screenParameters=JSON.stringify(formData); 
     var popupWidth=window.innerWidth*0.8;
    popupWidth=Math.floor(popupWidth);
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/EndTaskButtonEvent';
    var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+ 
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"extendedProperties\":"+gExtendedProperties+","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+gTaskId+"\","+
        "\"WithCollectQuestion\":\""+gIsWithCollectQuestion+"\","+
        "\"parameters\":"+screenParameters+","+
        "\"poponWidth\":\""+popupWidth+"\"}";
  $.ajax({             
        type: 'POST',             
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,               
        success: function(data) {         
            if(data.status==="ok")
                {
                    eligibilityObject=data.eligibilityObject;
                    withValidatorControl=data.withValidatorControl;
                    myApp.hidePreloader();
                    if(data.poponContent!=undefined)
                        {
                    createPopup(data.poponContent,"","10%","10%","80%","80%");
                        }
                        else
                        {
                            if(withValidatorControl==="true")        
                            manageControlValidatorBehavior(data,mainItemId);    
                            else
                                {
                                    if(data.requiredDocuments!=undefined)
                                        {
                                             manageRequiredDocument(data,mainItemId);
                                        }
                                    else if(data.CollectQuestions!=null)
                                        {
                                            manageCollectQuestion(data.CollectQuestions);
                                        }
                                    else 
                                        {
                                            myApp.hidePreloader(); 
                                            gHomeBackButton.style.visibility="hidden";
                                            gExtendedProperties=null;
                                            mainView.router.back({force:true,pageName:"homePage"});
                                            mainView.history=["#homePage"];
                                            if(!checkInternetConnection())                                                   
                                                myApp.alert("please check your internet connection");
                                            else 
                                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                                        }                      
                                }
                        }
                }        
            else                               
                { 
                    myApp.hidePreloader();
                }  
        },  
        error: function(e) {         
            verifconnexion = false;
             myApp.hidePreloader();
            errorMessage(e.message);
        }                                         
    });      
}
function manageCollectQuestion(CollectQuestion){
      createPopup(CollectQuestion,"","10%","10%","80%","80%");
}
function manageControlValidatorBehavior(data,mainItemId){
    if(data.message!=undefined)    
                            {
                                var behavior=data.behavior;
                                if(behavior==="blockingAlert")
                                    {
                                        myApp.alert(data.message,"Exception");
                                    }
                                else if(behavior==="optionalAlert")
                                    {
                                         myApp.confirm(data.message, "Exception", function () {
                                          checkRequiredDocument(mainItemId);
                                         });
                                    }
                                else if (behavior==="deviationAlert")
                                    {
                                        deviatedMsg=data.message;
                                         var saveEventHandler='saveDeviationComment(\''+mainItemId+'\');';
                                         generateSaveCommentDeviationPopup(data.message,saveEventHandler);
                                    }
                            }
}
function checkRequiredDocument(mainItemId){
     myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form__'+mainItemId);
     var   screenParameters=JSON.stringify(formData); 
     var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/CheckRequiredDocumentOnEndTask';
     var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"extendedProperties\":"+gExtendedProperties+","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+gTaskId+"\","+
        "\"WithCollectQuestion\":\""+gIsWithCollectQuestion+"\","+
        "\"parameters\":"+screenParameters+"}";
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
                    if(data.requiredDocuments!=undefined)
                        {
                           myApp.hidePreloader();
                           manageRequiredDocument(data,mainItemId);
                        }
                    else
                        {
                          myApp.hidePreloader(); 
                            extendedProperties=null;
                            gHomeBackButton.style.visibility="hidden";       
                            mainView.router.back({force:true,pageName:"homePage"});
                            mainView.history=["#homePage"];
                            if(!checkInternetConnection())                                                   
                                myApp.alert("please check your internet connection");
                            else 
                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                }    
            else                       
                { 
                    myApp.hidePreloader();
                }
        },
});
}
function saveRequiredDocumentComent(mainItemId){
     var comment=document.getElementById("deviationComment").value; 
      myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form__'+mainItemId);
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveDeviationComment';
    var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"deviatedMsg\":\""+deviatedMsg+"\","+
        "\"requiredDocument\":\""+requiredDocument+"\","+
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+gTaskId+"\","+
        "\"extendedProperties\":"+gExtendedProperties+","+
        "\"comment\":\""+comment+"\","+
        "\"WithCollectQuestion\":\""+gIsWithCollectQuestion+"\","+
        "\"parameters\":"+screenParameters+"}";   
    
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
                    if(data.WithrequiredDocument!=undefined)
                        {
                         manageRequiredDocument(data,mainItemId);
                        }
                    else
                        {
                            myApp.hidePreloader(); 
                            gExtendedProperties=null;
                            gHomeBackButton.style.visibility="hidden";       
                            mainView.router.back({force:true,pageName:"homePage"});
                            mainView.history=["#homePage"];
                            if(!checkInternetConnection())                                                   
                                myApp.alert("please check your internet connection");
                            else 
                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                    
                }    
            else                         
                { 
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error"); 
                }
        },  
        error: function(e) {           
             
            verifconnexion = false;        
             myApp.hidePreloader();
            errorMessage(e.message);

        }                                         
    }); 
}
function saveDeviationComment(mainItemId){
    var comment=document.getElementById("deviationComment").value; 
    myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form__'+mainItemId);
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveDeviationComment';
     var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"deviatedMsg\":\""+deviatedMsg+"\","+
        "\"requiredDocument\":\"\","+
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+gTaskId+"\","+
         "\"WithCollectQuestion\":\""+gIsWithCollectQuestion+"\","+
         "\"extendedProperties\":"+gExtendedProperties+","+
        "\"comment\":\""+comment+"\","+
        "\"parameters\":"+screenParameters+"}"; 
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
                    if(data.WithrequiredDocument!=undefined)
                        {
                            if(data.deviation==="true")
                             manageRequiredDocument(data,mainItemId);
                            else
                           myApp.alert(data.message+"</br></br>"+data.requiredDocuments+"</br></br>","MACP") ;     
                        }
                    else if(data.endTask!=undefined)
                        {
                             gHomeBackButton.style.visibility="hidden";  
                             extendedProperties=null;
                             mainView.router.back({force:true,pageName:"homePage"});
                             mainView.history=["#homePage"];
                             if(!checkInternetConnection())                                                   
                                myApp.alert("please check your internet connection");
                            else 
                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                }      
            else                       
                { 
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error"); 
                }
        },
        error: function(e) {         
             
            verifconnexion = false;          
             myApp.hidePreloader();
            errorMessage(e.message);
        }                                         
    });       
}
function manageRequiredDocument(data,mainItemId){
     if(data.deviation==="true") {                 
     deviatedMsg=data.message;
     requiredDocument=data.requiredDocuments;
     var saveEventHandler='saveRequiredDocumentComent(\''+mainItemId+'\');';
    generateSaveCommentDeviationPopup(data.message+'</br></br>'+data.requiredDocuments+'</br></br>'+data.question,saveEventHandler);
         }
    else
        {
        myApp.alert(data.message+"</br></br>"+data.requiredDocuments+"</br>","MACP") ; 
        }
};
function saveEligibilityComment(mainItemId){
    
     myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form__'+mainItemId);
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveEligibilityComment';
    var data="{"+  
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"parameters\":"+screenParameters+","+
        "\"taskId\":\""+gTaskId+"\","+
        "\"WithCollectQuestion\":\""+gIsWithCollectQuestion+"\","+
        "\"eligibilityObject\":"+JSON.stringify(eligibilityObject)+","+
        "\"extendedProperties\":"+gExtendedProperties+","+
        "\"withValidatorControl\":\""+withValidatorControl.toLowerCase()+"\","+
        "\"commentList\":"+JSON.stringify(getCommentsList())+"}";
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
                    if(withValidatorControl==="True")
                        {
                            manageControlValidatorBehavior(data,mainItemId);
                        }
                    else if(data.WithrequiredDocument!=undefined)
                       manageRequiredDocument(data,mainItemId);
                    else
                        {
                        gHomeBackButton.style.visibility="hidden";     
                            gExtendedProperties=null;
                             mainView.router.back({force:true,pageName:"homePage"});
                             mainView.history=["#homePage"];
                             if(!checkInternetConnection())                                                   
                                 myApp.alert("please check your internet connection");
                             else 
                                 leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                    
                }    
            else                       
                { 
                    myApp.hidePreloader();
                     myApp.alert("error saving","Error"); 
                }
        },
        error: function(e) {         
            
            verifconnexion = false;        
            myApp.hidePreloader(); 
            errorMessage(e.message);

        }                                         
    });      
}
function getCommentsList(){
    var commentlist={};
   for (var j=0; j < eligibilityObject.length; j++)
   {
       var element=document.getElementById("endTaskComment__"+eligibilityObject[j].eligibility_criteria_id);
       var comment=element.value;     
       commentlist[eligibilityObject[j].eligibility_criteria_id] = comment;
   }
    
    return commentlist;
} 

function saveCollectQuestionEvent(mainItemId){   
    var formId = "#Collect-Question-form";
    var isValidForm = requiredFormComponent(formId); 
    if(isValidForm)
    {
       saveCollectQuestion(mainItemId);
       
    }
}

function saveCollectQuestion(mainItemId){ 
    myApp.closeModal();
    myApp.showPreloader();
     var collectQuestionData = myApp.formToData('#Collect-Question-form');
     var   collectQuestionParameters=JSON.stringify(collectQuestionData); 
      var formData = myApp.formToData('#my-mainData-form');
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveCollectQuestionAndEndTask';
    var data="{"+  
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"screenName\":\""+gSubItems+"\","+
        "\"parameters\":"+screenParameters+","+
        "\"collectQuestionParameters\":"+collectQuestionParameters+","+
        "\"taskId\":\""+gTaskId+"\"}";
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
                             gHomeBackButton.style.visibility="hidden";  
                             gExtendedProperties=null;
                             mainView.router.back({force:true,pageName:"homePage"});
                             mainView.history=["#homePage"];
                             if(!checkInternetConnection())                                                   
                                 myApp.alert("please check your internet connection");
                             else 
                                 leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        
                    
                }    
            else                       
                { 
                    myApp.hidePreloader();
                     myApp.alert("error saving","Error"); 
                }
        },
        error: function(e) {         
             
            verifconnexion = false;        
            myApp.hidePreloader(); 
            errorMessage(e.message);

        }                                         
    });      
    
    
}


  

